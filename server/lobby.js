const socketio = require('socket.io');
const config = require('./config.js');
const Socket = require('./socket.js');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const moment = require('moment');

const logger = require('./log.js');
const version = moment(require('../version.js'));
const PendingGame = require('./pendinggame.js');
const GameRouter = require('./gamerouter.js');
const MessageRepository = require('./repositories/messageRepository.js');
const DeckRepository = require('./repositories/deckRepository.js');

class Lobby {
    constructor(server) {
        this.sockets = {};
        this.users = {};
        this.games = {};
        this.messageRepository = new MessageRepository();
        this.deckRepository = new DeckRepository();
        this.router = new GameRouter();
        this.router.on('onGameClosed', this.onGameClosed.bind(this));

        this.io = socketio(server);
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));
    }

    // External methods
    getStatus() {
        var nodeStatus = this.router.getNodeStatus();

        return nodeStatus;
    }

    disableNode(nodeName) {
        return this.router.disableNode(nodeName);
    }

    enableNode(nodeName) {
        return this.router.enableNode(nodeName);
    }

    // Helpers
    findGameForUser(user) {
        return _.find(this.games, game => {
            return game.players[user] || game.spectators[user];
        });
    }

    handshake(socket, next) {
        var versionInfo = undefined;

        if(socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, config.secret, function(err, user) {
                if(err) {
                    logger.info(err);
                    return;
                }

                socket.request.user = user;
            });
        }

        if(socket.handshake.query.version) {
            versionInfo = moment(socket.handshake.query.version);
        }

        if(!versionInfo || versionInfo < version) {
            socket.emit('banner', 'Your client version is out of date, please refresh or clear your cache to get the latest version');
        }

        next();
    }

    // Actions
    broadcastMessage(message, ...params) {
        this.io.emit(message, ...params);
    }

    broadcastGameList(socket) {
        var gameSummaries = [];

        _.each(this.games, game => {
            gameSummaries.push(game.getSummary());
        });

        gameSummaries = _.sortBy(gameSummaries, 'createdAt').reverse();

        if(socket) {
            socket.send('games', gameSummaries);
        } else {
            this.broadcastMessage('games', gameSummaries);
        }
    }

    broadcastUserList() {
        var userList = _.map(this.users, function(user) {
            return {
                name: user.username,
                emailHash: user.emailHash
            };
        });

        this.broadcastMessage('users', userList);
    }

    sendGameState(game) {
        _.each(game.getPlayersAndSpectators(), player => {
            this.sockets[player.id].send('gamestate', game.getSummary(player.name));
        });
    }

    // Events
    onConnection(ioSocket) {
        var socket = new Socket(ioSocket);

        socket.registerEvent('lobbychat', this.onLobbyChat.bind(this));
        socket.registerEvent('newgame', this.onNewGame.bind(this));
        socket.registerEvent('joingame', this.onJoinGame.bind(this));
        socket.registerEvent('leavegame', this.onLeaveGame.bind(this));
        socket.registerEvent('watchgame', this.onWatchGame.bind(this));
        socket.registerEvent('startgame', this.onStartGame.bind(this));
        socket.registerEvent('chat', this.onPendingGameChat.bind(this));
        socket.registerEvent('selectdeck', this.onSelectDeck.bind(this));

        socket.on('authenticate', this.onAuthenticated.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;

        if(socket.user) {
            this.users[socket.user.username] = socket.user;
            this.broadcastUserList();
        }

        this.messageRepository.getLastMessages().then(messages => {
            socket.send('lobbymessages', messages.reverse());
        }).catch(err => {
            logger.info(err);
        });

        this.broadcastGameList();

        var game = this.findGameForUser(socket.user.username);
        if(game) {
            socket.send('handoff', { address: game.node.address, port: game.node.port });
        }
    }

    onAuthenticated(user) {
        this.users[user.username] = user;

        this.broadcastUserList();
    }

    onSocketDisconnected(socket) {
        if(!socket || !socket.user) {
            return;
        }

        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        if(game.started) {
            return;
        }

        game.disconnect(socket.user.username);
        socket.send('gamestate', game.getSummary(socket.user.username));
        socket.leaveChannel(game.id);

        if(game.isEmpty()) {
            delete this.games[game.id];
        } else {
            this.sendGameState(game);
        }

        this.broadcastGameList();
    }

    onNewGame(socket, gameDetails) {
        var existingGame = this.findGameForUser(socket.user);
        if(existingGame) {
            return;
        }

        var game = new PendingGame(socket.user, gameDetails);
        game.join(socket.id, socket.user);

        socket.joinChannel(game.id);
        this.sendGameState(game);

        this.games[game.id] = game;

        this.broadcastGameList();
    }

    onJoinGame(socket, gameId) {
        var existingGame = this.findGameForUser(socket.user);
        if(existingGame) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        if(game.join(socket.id, socket.user)) {
            socket.joinChannel(game.id);

            this.sendGameState(game);
        }

        this.broadcastGameList();
    }

    onStartGame(socket, gameId) {
        var game = this.games[gameId];

        if(!game || game.started) {
            return;
        }

        if(_.any(game.getPlayers(), function(player) {
            return !player.deck;
        })) {
            return;
        }

        if(!game.isOwner(socket.user.username)) {
            return;
        }

        var gameNode = this.router.startGame(game);
        if(!gameNode) {
            return;
        }

        game.node = gameNode;
        game.started = true;

        this.broadcastGameList();

        this.io.to(game.id).emit('handoff', { address: gameNode.address, port: gameNode.port });
    }

    onWatchGame(socket, gameId) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        if(game.watch(socket.id, socket.user)) {
            socket.joinChannel(game.id);

            if(game.started) {
                this.router.addSpectator(game, socket.user.username);
                socket.send('handoff', { address: game.node.address, port: game.node.port });
            } else {
                this.sendGameState(game);
            }
        }
    }

    onLeaveGame(socket) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.leave(socket.user.username);
        socket.send('gamestate', game.getSummary(socket.user.username));
        socket.leaveChannel(game.id);

        if(game.isEmpty()) {
            delete this.games[game.id];
        } else {
            this.sendGameState(game);
        }

        this.broadcastGameList();
    }

    onPendingGameChat(socket, message) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.chat(socket.user.username, message);
        this.sendGameState(game);
    }

    onLobbyChat(socket, message) {
        var chatMessage = { user: { username: socket.user.username, emailHash: socket.user.emailHash }, message: message, time: new Date() };

        this.messageRepository.addMessage(chatMessage);
        this.broadcastMessage('lobbychat', chatMessage);
    }

    onSelectDeck(socket, gameId, deckId) {
        if(_.isObject(deckId)) {
            deckId = deckId._id;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        this.deckRepository.getById(deckId).then(deck => {
            game.selectDeck(socket.user.username, deck);

            this.sendGameState(game);
        }).catch(err => {
            logger.info(err);
        });
    }

    // router Events
    onGameClosed(gameId) {
        delete this.games[gameId];

        this.broadcastGameList();
    }
}

module.exports = Lobby;
