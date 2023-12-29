const _ = require('underscore');
const { Server } = require('socket.io');
const Raven = require('raven');
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');
const fs = require('fs');

const config = require('config');
const { detectBinary } = require('../util');
const logger = require('../log.js');
const GameSocket = require('./gamesocket');
const Game = require('../game/game.js');
const Socket = require('../socket.js');
const ConfigService = require('../services/ConfigService');
const version = require('../../version.js');
const ServiceFactory = require('../services/ServiceFactory.js');
const jsondiffpatch = require('jsondiffpatch').create({
    objectHash: (obj, index) => {
        return obj.uuid || obj.name || obj.id || obj._id || '$$index:' + index;
    }
});

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

const customFetch = (endpoint, options) => {
    options.agent = httpsAgent;

    return fetch(endpoint, options);
};

const tokenIntrospection = require('token-introspection')({
    endpoint: 'https://localhost:7000/introspect',
    client_id: 'throneteki-nodes',
    client_secret: '8062B430-6733-415F-B142-DA022C1162EF',
    fetch: customFetch
});

if (config.sentryDsn) {
    Raven.config(config.sentryDsn, { release: version.build }).install();
}

class GameServer {
    constructor() {
        this.configService = new ConfigService();
        this.games = {};

        let configService = ServiceFactory.configService();

        this.protocol = 'https';

        try {
            var privateKey = fs.readFileSync(config.keyPath).toString();
            var certificate = fs.readFileSync(config.certPath).toString();
        } catch (e) {
            this.protocol = 'http';
        }

        this.host = process.env.HOST || configService.getValueForSection('gameNode', 'host');

        this.gameSocket = new GameSocket(configService, this.protocol);

        this.gameSocket.on('onStartGame', this.onStartGame.bind(this));
        this.gameSocket.on('onSpectator', this.onSpectator.bind(this));
        this.gameSocket.on('onGameSync', this.onGameSync.bind(this));
        this.gameSocket.on('onFailedConnect', this.onFailedConnect.bind(this));
        this.gameSocket.on('onCloseGame', this.onCloseGame.bind(this));
        this.gameSocket.on('onCardData', this.onCardData.bind(this));

        this.gameSocket.init();

        var server = undefined;

        if (!privateKey || !certificate) {
            server = http.createServer();
        } else {
            server = https.createServer({ key: privateKey, cert: certificate });
        }

        server.listen(
            process.env.PORT || configService.getValueForSection('gameNode', 'socketioPort')
        );

        var options = {
            perMessageDeflate: false
        };

        if (process.env.NODE_ENV !== 'production') {
            options.path =
                '/' +
                (process.env.SERVER || configService.getValueForSection('gameNode', 'name')) +
                '/socket.io';
        }

        if (process.env.NODE_ENV === 'production') {
            options.cors = {
                origins:
                    'http://www.throneteki.net:* https://www.throneteki.net:* http://www.theironthrone.net:* https://www.theironthrone.net:*'
            };
        } else {
            options.cors = {
                origins: true
            };
        }

        this.io = new Server(server, options);
        //     this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));

        this.io.on('connection', this.onConnection.bind(this));

        setInterval(() => this.clearStaleAndFinishedGames(), 30 * 1000);
    }

    debugDump() {
        var games = _.map(this.games, (game) => {
            var players = _.map(game.playersAndSpectators, (player) => {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: !!player.disconnectedAt,
                    id: player.id,
                    spectator: player.isSpectator()
                };
            });

            return {
                name: game.name,
                players: players,
                id: game.id,
                started: game.started,
                startedAt: game.startedAt
            };
        });

        return {
            games: games,
            gameCount: _.size(this.games)
        };
    }

    handleError(game, e) {
        logger.error(e);

        let gameState = game.getState();
        let debugData = {};

        if (e.message.includes('Maximum call stack')) {
            debugData.badSerializaton = detectBinary(gameState);
        } else {
            debugData.game = gameState;
            debugData.game.players = undefined;

            debugData.messages = game.getPlainTextLog();
            debugData.game.messages = undefined;

            _.each(game.getPlayers(), (player) => {
                debugData[player.name] = player.getState(player);
            });
        }

        Raven.captureException(e, { extra: debugData });

        if (game) {
            game.addMessage(
                'A Server error has occured processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.'
            );
        }
    }

    closeGame(game) {
        for (let player of Object.values(game.getPlayersAndSpectators())) {
            if (player.socket) {
                player.socket.tIsClosing = true;
                player.socket.disconnect();
            }
        }

        delete this.games[game.id];
        this.gameSocket.send('GAMECLOSED2', { game: game.id });
    }

    clearStaleAndFinishedGames() {
        const timeout = 20 * 60 * 1000;

        let staleGames = Object.values(this.games).filter(
            (game) => game.finishedAt && Date.now() - game.finishedAt > timeout
        );
        for (let game of staleGames) {
            logger.info('closed finished game', game.id, 'due to inactivity');
            this.closeGame(game);
        }

        let emptyGames = Object.values(this.games).filter((game) => game.isEmpty());
        for (let game of emptyGames) {
            logger.info('closed empty game', game.id);
            this.closeGame(game);
        }
    }

    runAndCatchErrors(game, func) {
        try {
            func();
        } catch (e) {
            this.handleError(game, e);

            this.sendGameState(game);
        }
    }

    findGameForUser(username) {
        return _.find(this.games, (game) => {
            var player = game.playersAndSpectators[username];

            if (!player || player.left) {
                return false;
            }

            return true;
        });
    }

    sendGameState(game) {
        _.each(game.getPlayersAndSpectators(), (player) => {
            if (player.left || player.disconnectedAt || !player.socket) {
                return;
            }

            let state = game.getState(player.name);

            let stateToSend = state;

            if (game.jsonForUsers[player.name]) {
                stateToSend = jsondiffpatch.diff(game.jsonForUsers[player.name], state);
            }

            player.socket.send('gamestate', stateToSend);

            game.jsonForUsers[player.name] = jsondiffpatch.clone(state);
        });
    }

    async handshake(socket, next) {
        if (socket.handshake.auth.token) {
            try {
                socket.request.user = await tokenIntrospection(socket.handshake.auth.token);
            } catch (err) {
                logger.error(err);
            }
        }

        next();
    }

    gameWon(game, reason, winner) {
        this.gameSocket.send('GAMEWIN2', {
            game: game.getSaveState(),
            winner: winner.name,
            reason: reason
        });
    }

    rematch(game) {
        this.gameSocket.send('REMATCH2', { game: game.getSaveState() });

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            if (player.left || player.disconnected || !player.socket) {
                continue;
            }

            player.socket.send('cleargamestate');
            player.socket.leaveChannel(game.id);
            player.left = true; // So they don't get game state sent after the /rematch command is issued
        }

        delete this.games[game.id];
    }

    onStartGame(pendingGame) {
        let game = new Game(pendingGame, {
            router: this,
            titleCardData: this.titleCardData,
            cardData: this.cardData,
            packData: this.packData,
            restrictedListData: this.restrictedListData
        });
        game.on('onTimeExpired', () => {
            this.sendGameState(game);
        });
        this.games[pendingGame.id] = game;

        game.started = true;
        for (let player of Object.values(pendingGame.players)) {
            game.selectDeck(player.name, player.deck);
        }

        game.initialise();
        if (pendingGame.rematch) {
            game.addAlert('info', 'The rematch is ready');
        }
    }

    onSpectator(pendingGame, user) {
        var game = this.games[pendingGame.id];
        if (!game) {
            return;
        }

        game.watch('TBA', user);

        this.sendGameState(game);
    }

    onGameSync(callback) {
        var gameSummaries = _.map(this.games, (game) => {
            var retGame = game.getSummary(undefined, { fullData: true });
            retGame.password = game.password;

            return retGame;
        });

        logger.info('syncing %d games', _.size(gameSummaries));

        callback(gameSummaries);
    }

    onFailedConnect(gameId, username) {
        var game = this.findGameForUser(username);
        if (!game || game.id !== gameId) {
            return;
        }

        game.failedConnect(username);

        if (game.isEmpty()) {
            delete this.games[game.id];

            this.gameSocket.send('GAMECLOSED2', { game: game.id });
        }

        this.sendGameState(game);
    }

    onCloseGame(gameId) {
        let game = this.games[gameId];
        if (!game) {
            return;
        }

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            player.socket.send('cleargamestate');
            player.socket.leaveChannel(game.id);
        }

        delete this.games[gameId];
        this.gameSocket.send('GAMECLOSED2', { game: game.id });
    }

    onCardData(data) {
        //this.titleCardData = data.titleCardData;
        this.cardData = data.cards;
        this.packData = data.packs;
        //this.restrictedListData = data.restrictedListData;
    }

    onConnection(ioSocket) {
        ioSocket.on('ping', (cb) => {
            if (typeof cb === 'function') {
                cb();
            }
        });

        if (!ioSocket.request.user) {
            logger.info('socket connected with no user, disconnecting');
            ioSocket.disconnect();
            return;
        }

        var game = this.findGameForUser(ioSocket.request.user.username);
        if (!game) {
            logger.info('No game for %s, disconnecting', ioSocket.request.user.username);
            ioSocket.disconnect();
            return;
        }

        var socket = new Socket(ioSocket, { config: config });

        var player = game.playersAndSpectators[socket.user.username];
        if (!player) {
            return;
        }

        player.lobbyId = player.id;
        player.id = socket.id;
        player.connectionSucceeded = true;
        if (player.disconnectedAt) {
            logger.info("user '%s' reconnected to game", socket.user.username);
            game.reconnect(socket, player.name);
        }

        socket.joinChannel(game.id);

        player.socket = socket;

        if (!player.isSpectator(player) && !player.disconnectedAt) {
            game.addMessage('{0} has connected to the game server', player);
        }

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));
    }

    onSocketDisconnected(socket, reason) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        logger.info("user '%s' disconnected from a game: %s", socket.user.username, reason);

        let player = game.playersAndSpectators[socket.user.username];
        if (player.id !== socket.id) {
            return;
        }

        let isSpectator = player && player.isSpectator();

        game.disconnect(socket.user.username);

        if (!socket.tIsClosing) {
            if (game.isEmpty()) {
                delete this.games[game.id];

                this.gameSocket.send('GAMECLOSED2', { game: game.id });
            } else if (isSpectator) {
                this.gameSocket.send('PLAYERLEFT2', {
                    gameId: game.id,
                    game: game.getSaveState(),
                    player: socket.user.username,
                    spectator: true
                });
            }
        }

        this.sendGameState(game);
    }

    onLeaveGame(socket) {
        var game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        let player = game.playersAndSpectators[socket.user.username];
        let isSpectator = player.isSpectator();

        game.leave(socket.user.username);

        this.gameSocket.send('PLAYERLEFT2', {
            gameId: game.id,
            game: game.getSaveState(),
            player: socket.user.username,
            spectator: isSpectator
        });

        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if (game.isEmpty()) {
            delete this.games[game.id];

            this.gameSocket.send('GAMECLOSED2', { game: game.id });
        }

        this.sendGameState(game);
    }

    onGameMessage(socket, command, ...args) {
        var game = this.findGameForUser(socket.user.username);

        if (!game) {
            return;
        }

        if (command === 'leavegame') {
            return this.onLeaveGame(socket);
        }

        if (!game[command] || !_.isFunction(game[command])) {
            return;
        }

        this.runAndCatchErrors(game, () => {
            game[command](socket.user.username, ...args);

            game.continue();

            this.sendGameState(game);
        });
    }
}

module.exports = GameServer;
