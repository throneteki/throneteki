import { Server as socketio } from 'socket.io';
import Socket from './socket.js';
import jwt from 'jsonwebtoken';
import _ from 'underscore';
import { validateDeck, formatDeckAsFullCards } from '../deck-helper/index.js';
import logger from './log.js';
import PendingGame from './pendinggame.js';
import GameRouter from './gamerouter.js';
import ServiceFactory from './services/ServiceFactory.js';
import DeckService from './services/DeckService.js';
import CardService from './services/CardService.js';
import EventService from './services/EventService.js';
import User from './models/User.js';
import { sortBy } from './Array.js';

class Lobby {
    constructor(server, options = {}) {
        this.instance = options.instance;

        this.sockets = {};
        this.users = {};
        this.games = {};
        this.configService = options.configService || ServiceFactory.configService();
        this.messageService = options.messageService || ServiceFactory.messageService(options.db);
        this.cardService = options.cardService || new CardService(options.db);
        this.deckService = options.deckService || new DeckService(options.db, this.cardService);
        this.eventService = options.eventService || new EventService(options.db);
        this.userService =
            options.userService || ServiceFactory.userService(options.db, this.configService);
        this.router = options.router || new GameRouter(options.db);

        this.router.on('onGameClosed', this.onGameClosed.bind(this));
        this.router.on('onGameRematch', this.onGameRematch.bind(this));
        this.router.on('onPlayerLeft', this.onPlayerLeft.bind(this));
        this.router.on('onWorkerTimedOut', this.onWorkerTimedOut.bind(this));
        this.router.on('onNodeReconnected', this.onNodeReconnected.bind(this));
        this.router.on('onWorkerStarted', this.onWorkerStarted.bind(this));

        this.userService.on('onBlocklistChanged', this.onBlocklistChanged.bind(this));

        this.io = options.io || new socketio(server, { perMessageDeflate: false });
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));

        this.messageService.on('messageDeleted', (messageId) => {
            this.io.emit('removemessage', messageId);
        });

        setInterval(() => this.clearStalePendingGames(), 60 * 1000);
    }

    async init() {
        await this.deckService.init();
        await this.eventService.init();
    }

    // External methods
    getStatus() {
        return this.router.getNodeStatus();
    }

    disableNode(nodeName) {
        return this.router.disableNode(nodeName);
    }

    enableNode(nodeName) {
        return this.router.enableNode(nodeName);
    }

    debugDump() {
        let games = Object.values(this.games).map((game) => {
            let players = Object.values(game.players).map((player) => {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: player.disconnected,
                    id: player.id
                };
            });

            let spectators = Object.values(game.spectators).map((spectator) => {
                return {
                    name: spectator.name,
                    id: spectator.id
                };
            });

            return {
                name: game.name,
                players: players,
                spectators: spectators,
                id: game.id,
                started: game.started,
                node: game.node ? game.node.identity : 'None',
                startedAt: game.createdAt
            };
        });

        let nodes = this.router.getNodeStatus();

        return {
            games: games,
            nodes: nodes,
            socketCount: Object.values(this.sockets).length,
            userCount: Object.values(this.users).length
        };
    }

    // Helpers
    findGameForUser(user) {
        return Object.values(this.games).find((game) => {
            if (game.spectators[user]) {
                return true;
            }

            let player = game.players[user];

            if (!player || player.left) {
                return false;
            }

            return true;
        });
    }

    getUserList() {
        let userList = Object.values(this.users).map((user) => {
            return user.getShortSummary();
        });

        userList = sortBy(userList, (user) => {
            return user.name.toLowerCase();
        });

        return userList;
    }

    handshake(ioSocket, next) {
        if (ioSocket.handshake.auth.token && ioSocket.handshake.auth.token !== 'undefined') {
            jwt.verify(
                ioSocket.handshake.auth.token,
                this.configService.getValue('secret'),
                (err, user) => {
                    if (err) {
                        ioSocket.emit('authfailed');
                        return;
                    }

                    this.userService
                        .getUserById(user._id)
                        .then((dbUser) => {
                            let socket = this.sockets[ioSocket.id];
                            if (!socket) {
                                logger.error(
                                    'Tried to authenticate socket but could not find it %s',
                                    dbUser.username
                                );
                                return;
                            }

                            if (dbUser.disabled) {
                                ioSocket.disconnect();
                                return;
                            }

                            ioSocket.request.user = dbUser.getWireSafeDetails();
                            socket.user = dbUser;
                            this.users[dbUser.username] = socket.user;

                            this.doPostAuth(socket);
                        })
                        .catch((err) => {
                            logger.error(err);
                        });
                }
            );
        }

        if ((process.env.VERSION || 'Local build') !== ioSocket.handshake.query.version) {
            ioSocket.emit(
                'banner',
                'Your client version is out of date, please refresh or clear your cache to get the latest version'
            );
        }

        next();
    }

    // Actions
    mapGamesToGameSummaries(games) {
        return _.chain(games)
            .map((game) => game.getSummary())
            .sortBy('createdAt')
            .sortBy('started')
            .reverse()
            .value();
    }

    sendUserListFilteredWithBlockList(socket, userList) {
        let filteredUsers = userList;

        if (socket.user) {
            filteredUsers = userList.filter((user) => {
                return !socket.user.hasUserBlocked(user);
            });
        }

        socket.send('users', filteredUsers);
    }

    broadcastUserMessage(user, message) {
        for (let socket of Object.values(this.sockets)) {
            if (socket.user === user || (socket.user && socket.user.hasUserBlocked(user))) {
                continue;
            }

            socket.send(message, user.getShortSummary());
        }
    }

    broadcastGameMessage(message, games) {
        if (!Array.isArray(games)) {
            games = [games];
        }

        for (let socket of Object.values(this.sockets)) {
            if (!socket) {
                continue;
            }

            let filteredGames = Object.values(games).filter((game) =>
                game.isVisibleFor(socket.user)
            );
            let gameSummaries = filteredGames.map((game) => game.getSummary());

            socket.send(message, gameSummaries);
        }
    }

    broadcastGameList(socket) {
        let sockets = {};

        if (socket) {
            sockets[socket.id] = socket;
        } else {
            sockets = this.sockets;
        }

        for (let socket of Object.values(sockets)) {
            let filteredGames = Object.values(this.games).filter((game) =>
                game.isVisibleFor(socket.user)
            );
            let gameSummaries = this.mapGamesToGameSummaries(filteredGames);
            socket.send('games', gameSummaries);
        }
    }

    broadcastUserList() {
        let users = this.getUserList();

        for (let socket of Object.values(this.sockets)) {
            this.sendUserListFilteredWithBlockList(socket, users);
        }
    }

    sendGameState(game) {
        if (game.started) {
            return;
        }

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            if (!this.sockets[player.id]) {
                logger.info('Wanted to send to %s but have no socket', player.id);
                continue;
            }

            this.sockets[player.id].send('gamestate', game.getSummary(player.name));
        }
    }

    clearGamesForNode(nodeName) {
        for (let game of Object.values(this.games)) {
            if (game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        }

        this.broadcastGameList();
    }

    clearStalePendingGames() {
        const timeout = 15 * 60 * 1000;
        let staleGames = Object.values(this.games).filter(
            (game) => !game.started && Date.now() - game.createdAt > timeout
        );

        for (let game of staleGames) {
            logger.info('closed pending game %s due to inactivity', game.id);
            delete this.games[game.id];
        }

        if (staleGames.length > 0) {
            this.broadcastGameMessage('removegame', staleGames);
        }
    }

    sendFilteredMessages(socket) {
        this.messageService
            .getLastMessages(socket.user?.permissions?.canModerateChat)
            .then((messages) => {
                let messagesToSend = this.filterMessages(messages, socket);
                socket.send('lobbymessages', messagesToSend.reverse());
            });
    }

    filterMessages(messages, socket) {
        if (!socket.user) {
            return messages;
        }

        return messages.filter((message) => {
            return !socket.user.hasUserBlocked(message.user);
        });
    }

    // Events
    onConnection(ioSocket) {
        ioSocket.on('ping', (cb) => {
            if (typeof cb === 'function') cb();
        });

        let socket = new Socket(ioSocket, { configService: this.configService });

        socket.registerEvent('lobbychat', this.onLobbyChat.bind(this));
        socket.registerEvent('newgame', this.onNewGame.bind(this));
        socket.registerEvent('joingame', this.onJoinGame.bind(this));
        socket.registerEvent('leavegame', this.onLeaveGame.bind(this));
        socket.registerEvent('watchgame', this.onWatchGame.bind(this));
        socket.registerEvent('startgame', this.onStartGame.bind(this));
        socket.registerEvent('chat', this.onPendingGameChat.bind(this));
        socket.registerEvent('selectdeck', this.onSelectDeck.bind(this));
        socket.registerEvent('connectfailed', this.onConnectFailed.bind(this));
        socket.registerEvent('removegame', this.onRemoveGame.bind(this));
        socket.registerEvent('clearsessions', this.onClearSessions.bind(this));
        socket.registerEvent('getnodestatus', this.onGetNodeStatus.bind(this));
        socket.registerEvent('togglenode', this.onToggleNode.bind(this));
        socket.registerEvent('restartnode', this.onRestartNode.bind(this));
        socket.registerEvent('motd', this.onMotdChange.bind(this));

        socket.on('authenticate', this.onAuthenticated.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;

        if (socket.user) {
            this.users[socket.user.username] = socket.user;

            this.broadcastUserMessage(socket.user, 'newuser');
        }

        this.sendUserListFilteredWithBlockList(socket, this.getUserList());
        this.sendFilteredMessages(socket);
        this.broadcastGameList(socket);

        this.messageService
            .getMotdMessage()
            .then((message) => {
                if (message) {
                    socket.send('motd', message[0]);
                }
            })
            .catch((err) => {
                logger.error(err);
            });

        if (!socket.user) {
            return;
        }

        let game = this.findGameForUser(socket.user.username);
        if (game && game.started) {
            this.sendHandoff(socket, game.node, game.id);
        }
    }

    doPostAuth(socket) {
        let user = socket.user;

        if (!user) {
            return;
        }

        this.broadcastUserMessage(user, 'newuser');
        this.sendFilteredMessages(socket);
        this.sendUserListFilteredWithBlockList(socket, this.getUserList());
        this.broadcastGameList(socket);

        let game = this.findGameForUser(user.username);
        if (game && game.started) {
            this.sendHandoff(socket, game.node, game.id);
        }
    }

    onAuthenticated(socket, user) {
        if (socket.user) {
            return;
        }

        this.userService
            .getUserById(user._id)
            .then((dbUser) => {
                this.users[dbUser.username] = dbUser;
                socket.user = dbUser;

                this.doPostAuth(socket);
            })
            .catch((err) => {
                logger.error(err);
            });
    }

    onSocketDisconnected(socket, reason) {
        if (!socket) {
            return;
        }

        delete this.sockets[socket.id];

        if (!socket.user) {
            return;
        }

        this.broadcastUserMessage(socket.user, 'userleft');

        delete this.users[socket.user.username];

        logger.info("user '%s' disconnected from the lobby: %s", socket.user.username, reason);

        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        game.disconnect(socket.user.username);

        if (game.isEmpty()) {
            this.broadcastGameMessage('removegame', game);
            delete this.games[game.id];
        } else {
            this.broadcastGameMessage('updategame', game);
            this.sendGameState(game);
        }
    }

    onNewGame(socket, gameDetails) {
        let existingGame = this.findGameForUser(socket.user.username);
        if (existingGame) {
            return;
        }

        if (gameDetails.quickJoin) {
            let sortedGames = sortBy(Object.values(this.games), (game) => game.createdAt);
            let gameToJoin = sortedGames.find(
                (game) =>
                    !game.started &&
                    game.gameType === gameDetails.gameType &&
                    Object.values(game.players).length < 2 &&
                    !game.password &&
                    !game.gamePrivate
            );

            if (gameToJoin) {
                let message = gameToJoin.join(socket.id, socket.user);
                if (message) {
                    socket.send('passworderror', message);

                    return;
                }

                socket.joinChannel(gameToJoin.id);

                this.sendGameState(gameToJoin);
                this.broadcastGameMessage('updategame', gameToJoin);

                return;
            }
        }

        const restrictedListsResult = this.cardService.getRestrictedList();
        const eventResult =
            !gameDetails.eventId || gameDetails.eventId === 'none'
                ? Promise.resolve({ _id: 'none' })
                : this.eventService.getEventById(gameDetails.eventId);

        return Promise.all([eventResult, restrictedListsResult]).then(
            ([event, restrictedLists]) => {
                const defaultRestrictedList = restrictedLists[0];
                let restrictedList;

                //when there is no event chosen for the game, use the restricted list that was chosen or the default restricted list (first one in the list)
                if (gameDetails.eventId === 'none') {
                    restrictedList =
                        restrictedLists.find(
                            (restrictedList) => restrictedList._id === gameDetails.restrictedListId
                        ) || defaultRestrictedList;
                    //when there is an event chosen for the game, check if the event uses a custom or a default restricted list
                } else {
                    if (event.useDefaultRestrictedList && event.defaultRestrictedList) {
                        restrictedList =
                            restrictedLists.find(
                                (restrictedList) =>
                                    restrictedList.name === event.defaultRestrictedList
                            ) || defaultRestrictedList;
                    } else {
                        restrictedList =
                            restrictedLists.find(
                                (restrictedList) => restrictedList.name === event.name
                            ) || defaultRestrictedList;
                    }
                }

                let game = new PendingGame(socket.user, this.instance, {
                    event,
                    restrictedList,
                    ...gameDetails
                });
                game.newGame(socket.id, socket.user, gameDetails.password, true);

                socket.joinChannel(game.id);
                this.sendGameState(game);

                this.games[game.id] = game;
                this.broadcastGameMessage('newgame', game);
            }
        );
    }

    onJoinGame(socket, gameId, password) {
        let existingGame = this.findGameForUser(socket.user.username);
        if (existingGame) {
            return;
        }

        let game = this.games[gameId];
        if (!game) {
            return;
        }

        let message = game.join(socket.id, socket.user, password);
        if (message) {
            socket.send('passworderror', message);
            return;
        }

        socket.joinChannel(game.id);

        this.sendGameState(game);
        this.broadcastGameMessage('updategame', game);
    }

    onStartGame(socket) {
        let game = this.findGameForUser(socket.user.username);

        if (!game || game.started) {
            return;
        }

        if (
            Object.values(game.getPlayers()).some((player) => {
                return !player.deck;
            })
        ) {
            return;
        }

        if (!game.isOwner(socket.user.username)) {
            return;
        }

        let gameNode = this.router.startGame(game);
        if (!gameNode) {
            socket.send('gameerror', 'No game nodes available. Try again later.');
            return;
        }

        game.node = gameNode;
        game.started = true;

        this.broadcastGameMessage('updategame', game);

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            let socket = this.sockets[player.id];

            if (!socket || !socket.user) {
                logger.error(`Wanted to handoff to ${player.name}, but couldn't find a socket`);
                continue;
            }

            this.sendHandoff(socket, gameNode, game.id);
        }
    }

    sendHandoff(socket, gameNode, gameId) {
        let authToken = jwt.sign(
            socket.user.getWireSafeDetails(),
            this.configService.getValue('secret'),
            { expiresIn: '5m' }
        );

        socket.send('handoff', {
            address: gameNode.address,
            port: gameNode.port,
            protocol: gameNode.protocol,
            name: gameNode.identity,
            authToken: authToken,
            gameId: gameId
        });
    }

    onWatchGame(socket, gameId, password) {
        let existingGame = this.findGameForUser(socket.user.username);
        if (existingGame) {
            return;
        }

        let game = this.games[gameId];
        if (!game) {
            return;
        }

        let message = game.watch(socket.id, socket.user, password);
        if (message) {
            socket.send('passworderror', message);

            return;
        }

        socket.joinChannel(game.id);

        if (game.started) {
            this.router.addSpectator(game, socket.user.getDetails());
            this.sendHandoff(socket, game.node, game.id);
        } else {
            this.sendGameState(game);
        }
    }

    onLeaveGame(socket) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        game.leave(socket.user.username);
        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if (game.isEmpty()) {
            this.broadcastGameMessage('removegame', game);
            delete this.games[game.id];
        } else {
            this.broadcastGameMessage('updategame', game);
            this.sendGameState(game);
        }
    }

    onPendingGameChat(socket, message) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        game.chat(socket.user.username, message);
        this.sendGameState(game);
    }

    async onLobbyChat(socket, message) {
        if (
            Date.now() - socket.user.registered <
            this.configService.getValue('minLobbyChatTime') * 1000
        ) {
            socket.send('nochat');
            return;
        }

        let chatMessage = {
            user: socket.user.getShortSummary(),
            message: message,
            time: new Date()
        };
        let newMessage = await this.messageService.addMessage(chatMessage);
        for (let s of Object.values(this.sockets)) {
            if (s.user && s.user.hasUserBlocked(socket.user)) {
                continue;
            }

            s.send('lobbychat', newMessage);
        }
    }

    onSelectDeck(socket, deckId) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        return Promise.all([
            this.cardService.getAllCards(),
            this.cardService.getAllPacks(),
            this.deckService.getById(deckId)
        ])
            .then((results) => {
                let [cards, packs, deck] = results;
                let formattedDeck = formatDeckAsFullCards(deck, { cards: cards });

                formattedDeck.status = validateDeck(formattedDeck, {
                    packs: packs,
                    restrictedLists: [game.restrictedList],
                    includeExtendedStatus: false
                });

                game.selectDeck(socket.user.username, formattedDeck);

                this.sendGameState(game);
            })
            .catch((err) => {
                logger.info(err);

                return;
            });
    }

    onConnectFailed(socket) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        logger.info("user '%s' failed to handoff to game server", socket.user.username);
        this.router.notifyFailedConnect(game, socket.user.username);
    }

    onRemoveGame(socket, gameId) {
        if (!socket.user.permissions.canManageGames) {
            return;
        }

        let game = this.games[gameId];
        if (!game) {
            return;
        }

        logger.info(socket.user.username, 'closed game %s (%s) forcefully', game.id, game.name);

        if (!game.started) {
            delete this.games[game.id];
        } else {
            this.router.closeGame(game);
        }
    }

    onGetNodeStatus(socket) {
        if (!socket.user.permissions.canManageNodes) {
            return;
        }

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onToggleNode(socket, node) {
        if (!socket.user.permissions.canManageNodes) {
            return;
        }

        this.router.toggleNode(node);

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onRestartNode(socket, node) {
        if (!socket.user.permissions.canManageNodes) {
            return;
        }

        this.router.restartNode(node);

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onMotdChange(socket, motd) {
        if (!socket.user.permissions.canManageMotd) {
            return;
        }

        let newMotd =
            motd && motd.message
                ? {
                      message: motd.message,
                      motdType: motd.motdType,
                      type: 'motd',
                      user: socket.user.getShortSummary(),
                      time: new Date()
                  }
                : {};

        this.messageService
            .setMotdMessage(newMotd)
            .then(() => {
                this.io.emit('motd', { message: newMotd.message, motdType: newMotd.motdType });
            })
            .catch((err) => {
                logger.error(err);
            });
    }

    // router Events
    onGameClosed(gameId) {
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        delete this.games[gameId];
        this.broadcastGameMessage('removegame', game);
    }

    onGameRematch(oldGame) {
        let gameId = oldGame.gameId;
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        delete this.games[gameId];
        this.broadcastGameMessage('removegame', game);

        let newGame = new PendingGame(game.owner, game.instance, {
            name: game.name,
            event: game.event,
            restrictedList: game.restrictedList,
            spectators: game.allowSpectators,
            showHand: game.showHand,
            gameType: game.gameType,
            gamePrivate: game.gamePrivate,
            isMelee: game.isMelee,
            useGameTimeLimit: game.useGameTimeLimit,
            gameTimeLimit: game.gameTimeLimit,
            useChessClocks: game.useChessClocks,
            chessClockTimeLimit: game.chessClockTimeLimit,
            delayToStartClock: game.delayToStartClock
        });
        newGame.rematch = true;

        let owner = game.getPlayerOrSpectator(game.owner.username);
        if (!owner) {
            logger.error("Tried to rematch but the owner wasn't in the game");
            return;
        }

        let socket = this.sockets[owner.id];
        if (!socket) {
            logger.error("Tried to rematch but the owner's socket has gone away");
            return;
        }

        this.games[newGame.id] = newGame;
        newGame.newGame(socket.id, socket.user, null, true);

        socket.joinChannel(newGame.id);
        this.sendGameState(newGame);

        let promises = [this.onSelectDeck(socket, newGame.id, owner.deck._id)];

        for (let player of Object.values(game.getPlayers()).filter(
            (player) => player.name !== newGame.owner.username
        )) {
            let socket = this.sockets[player.id];

            if (!socket) {
                logger.warn(
                    `Tried to add ${player.name} to a rematch but couldn't find their socket`
                );
                continue;
            }

            newGame.join(socket.id, player.user);
            promises.push(this.onSelectDeck(socket, newGame.id, player.deck._id));
        }

        for (let spectator of game.getSpectators()) {
            let socket = this.sockets[spectator.id];

            if (!socket) {
                logger.warn(
                    `Tried to add ${spectator.name} to spectate a rematch but couldn't find their socket`
                );
                continue;
            }

            newGame.watch(socket.id, spectator.user);
        }

        // Set the password after everyone has joined, so we don't need to worry about overriding the password, or storing it unencrypted/hashed
        newGame.password = game.password;

        Promise.all(promises).then(() => {
            this.onStartGame(socket, newGame.id);
        });

        this.broadcastGameMessage('newgame', newGame);
    }

    onPlayerLeft(gameId, player) {
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        game.leave(player);

        if (game.isEmpty()) {
            this.broadcastGameMessage('removegame', game);
            delete this.games[gameId];
        } else {
            this.broadcastGameMessage('updategame', game);
        }
    }

    onClearSessions(socket, username) {
        this.userService.clearUserSessions(username).then((success) => {
            if (!success) {
                logger.error(`Failed to clear sessions for user ${username}`, username);
                return;
            }

            let game = this.findGameForUser(username);

            if (game) {
                logger.info(
                    'closed game %s (%s) forcefully due to clear session on %s',
                    game.id,
                    game.name,
                    username
                );

                if (!game.started) {
                    delete this.games[game.id];
                } else {
                    this.router.closeGame(game);
                }
            }

            let socket = Object.values(this.sockets).find((socket) => {
                return socket.user && socket.user.username === username;
            });

            if (socket) {
                socket.disconnect();
            }
        });
    }

    onBlocklistChanged(user) {
        let updatedUser = this.users[user.username];

        if (!updatedUser) {
            return;
        }

        updatedUser.blockList = user.blockList;
    }

    onWorkerTimedOut(nodeName) {
        this.clearGamesForNode(nodeName);
    }

    onWorkerStarted(nodeName) {
        Promise.all([
            this.cardService.getAllCards(),
            this.cardService.getTitleCards(),
            this.cardService.getAllPacks(),
            this.cardService.getRestrictedList()
        ]).then((results) => {
            let [cards, titles, packs, restrictedList] = results;
            this.router.sendCommand(nodeName, 'CARDDATA', {
                titleCardData: titles,
                cardData: cards,
                packData: packs,
                restrictedListData: restrictedList
            });
        });
    }

    onNodeReconnected(nodeName, games) {
        for (let game of Object.values(games)) {
            let owner = game.players[game.owner];

            if (!owner) {
                logger.error("Got a game where the owner wasn't a player: %s", game.owner);
                continue;
            }

            let syncGame = new PendingGame(new User(owner.user), game.instance, {
                spectators: game.allowSpectators,
                name: game.name,
                event: game.event
            });
            syncGame.id = game.id;
            syncGame.node = this.router.workers[nodeName];
            syncGame.createdAt = game.startedAt;
            syncGame.started = game.started;
            syncGame.gameType = game.gameType;
            syncGame.password = game.password;
            syncGame.restrictedList = game.restrictedList;

            for (let player of Object.values(game.players)) {
                syncGame.players[player.name] = {
                    id: player.id,
                    name: player.name,
                    owner: game.owner === player.name,
                    faction: { cardData: { code: player.faction } },
                    agendas: player.agendas?.map((code) => ({ cardData: { code } })),
                    user: new User(player.user)
                };
            }

            for (let player of Object.values(game.spectators)) {
                syncGame.spectators[player.name] = {
                    id: player.id,
                    name: player.name,
                    user: new User(player.user)
                };
            }

            this.games[syncGame.id] = syncGame;
        }

        for (let game of Object.values(this.games)) {
            if (
                game.node &&
                game.node.identity === nodeName &&
                Object.values(games).find((nodeGame) => {
                    return nodeGame.id === game.id;
                })
            ) {
                this.games[game.id] = game;
            } else if (game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        }

        this.broadcastGameList();
    }
}

export default Lobby;
