const _ = require('underscore');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Raven = require('raven');
const http = require('http');
const https = require('https');
const fs = require('fs');
const redis = require('async-redis');
const formatDeckAsFullCards = require('throneteki-deck-helper').formatDeckAsFullCards;

const config = require('./nodeconfig.js');
const { detectBinary } = require('../util');
const logger = require('../log.js');
const Game = require('../game/game.js');
const Socket = require('../socket.js');
const version = require('../../version.js');

if(config.sentryDsn) {
    Raven.config(config.sentryDsn, { release: version }).install();
}

class GameServer {
    constructor() {
        this.games = {};

        try {
            var privateKey = fs.readFileSync(config.keyPath).toString();
            var certificate = fs.readFileSync(config.certPath).toString();
        } catch(e) {
            logger.warn('Failed to load certificate/key, falling back to http', e);
        }

        this.host = process.env.HOST || config.host;
        this.redisClient = redis.createClient();
        this.onRedisConnect = this.onRedisConnect.bind(this);
        this.redisClient.on('connect', this.onRedisConnect);

        let server;

        if(!privateKey || !certificate) {
            server = http.createServer();
        } else {
            server = https.createServer({ key: privateKey, cert: certificate });
        }

        server.listen(process.env.PORT || config.socketioPort);

        var options = {
            perMessageDeflate: false
        };

        if(process.env.NODE_ENV !== 'production') {
            options.path = '/' + (process.env.SERVER || config.nodeIdentity) + '/socket.io';
        }

        this.io = socketio(server, options);
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));

        if(process.env.NODE_ENV === 'production') {
            this.io.set('origins', 'http://www.throneteki.net:* https://www.throneteki.net:* http://www.theironthrone.net:* https://www.theironthrone.net:*');
        }

        this.io.on('connection', this.onConnection.bind(this));

        setInterval(() => this.clearStaleFinishedGames(), 60 * 1000);
        setInterval(() => this.sendHeartbeat(), 30 * 1000);

        this.port = process.env.PORT || config.socketioPort;
        this.config = config;

        logger.info('Game Node', (process.env.SERVER || config.nodeIdentity), 'running on port', this.port);
    }

    onRedisConnect() {
        let address = this.host;

        if(process.env.NODE_ENV !== 'production') {
            address += ':' + this.port;
        }

        this.redisClient.publish('NodeHello', JSON.stringify({ address: address, name: process.env.SERVER || config.nodeIdentity }));
    }

    debugDump() {
        var games = _.map(this.games, game => {
            var players = _.map(game.playersAndSpectators, player => {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: player.disconnected,
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

        if(e.message.includes('Maximum call stack')) {
            debugData.badSerializaton = detectBinary(gameState);
        } else {
            debugData.game = gameState;
            debugData.game.players = undefined;

            debugData.messages = game.messages;
            debugData.game.messages = undefined;

            _.each(game.getPlayers(), player => {
                debugData[player.name] = player.getState(player);
            });
        }

        if(config.sentryDsn) {
            Raven.captureException(e, { extra: debugData });
        }

        if(game) {
            game.addMessage('A Server error has occured processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.');
        }
    }

    sendHeartbeat() {
        let address = this.host;

        if(process.env.NODE_ENV !== 'production') {
            address += ':' + this.port;
        }

        this.redisClient.publish('NodeHeartbeat', JSON.stringify({ address: address, name: process.env.SERVER || config.nodeIdentity }));
    }

    clearStaleFinishedGames() {
        const timeout = 20 * 60 * 1000;

        let staleGames = Object.values(this.games).filter(game => game.finishedAt && (Date.now() - game.finishedAt > timeout));
        for(let game of staleGames) {
            logger.warn('closed finished game', game.id, 'due to inactivity');
            for(let player of Object.values(game.getPlayersAndSpectators())) {
                if(player.socket) {
                    player.socket.tIsClosing = true;
                    player.socket.disconnect();
                }
            }

            delete this.games[game.id];
            this.closeGame(game).then(() => {
                logger.debug('Close game succeed');
            }).catch(err => {
                logger.error(err);
            });
        }
    }

    runAndCatchErrors(game, func) {
        try {
            func();
        } catch(e) {
            this.handleError(game, e);

            this.sendGameState(game);
        }
    }

    findGameForUser(user) {
        if(!this.games[user.gameId]) {
            return undefined;
        }

        let game = this.games[user.gameId];
        if(!game) {
            return undefined;
        }

        let player = game.playersAndSpectators[user.username];
        if(!player || player.left) {
            return undefined;
        }

        return game;
    }

    sendGameState(game) {
        _.each(game.getPlayersAndSpectators(), player => {
            if(player.left || player.disconnected || !player.socket) {
                return;
            }

            player.socket.send('gamestate', game.getState(player.name));
        });
    }

    handshake(socket, next) {
        if(socket.handshake.query.token && socket.handshake.query.token !== 'undefined') {
            jwt.verify(socket.handshake.query.token, config.secret, { audience: this.config.tokenIssuer, issuer: this.config.tokenIssuer }, function(err, token) {
                if(err) {
                    logger.warn('Failed to verify user', err);
                    return;
                }

                socket.request.user = { username: token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'], gameId: socket.handshake.query.gameId };
            });
        }

        next();
    }

    gameWon(game, reason, winner) {
        //this.zmqSocket.send('GAMEWIN', { game: game.getSaveState(), winner: winner.name, reason: reason });
    }

    async startNewGame(user) {
        if(this.games[user.gameId]) {
            return this.games[user.gameId];
        }

        let gameJson = await this.redisClient.get(`game:${user.gameId}`);
        if(!gameJson) {
            return undefined;
        }

        let lobbyGame;
        try {
            lobbyGame = JSON.parse(gameJson);
        } catch(err) {
            logger.error('error parsing JSON', err);
            return undefined;
        }

        let cardDataJson = await this.redisClient.get('cards');
        this.cardData = JSON.parse(cardDataJson);
        let factionString = await this.redisClient.get('factions');
        this.factions = JSON.parse(factionString);

        let game = new Game(lobbyGame, { router: this, titleCardData: this.titleCardData, cardData: this.cardData, packData: this.packData, restrictedListData: this.restrictedListData });
        this.games[lobbyGame.id] = game;

        game.started = true;
        for(let player of Object.values(lobbyGame.playersAndSpectators)) {
            if(player.isSpectator) {
                continue;
            }

            let customData = JSON.parse(player.customData);

            let deckString = await this.redisClient.get(`deck:${customData.deck.id}`);
            let deck = JSON.parse(deckString);

            let fullDeck = formatDeckAsFullCards(deck, { cards: this.cardData });

            game.selectDeck(player.user.name, fullDeck);
        }

        game.initialise();

        return game;
    }

    onSpectator(pendingGame, user) {
        var game = this.games[pendingGame.id];
        if(!game) {
            return;
        }

        game.watch('TBA', user);

        this.sendGameState(game);
    }

    onGameSync(callback) {
        var gameSummaries = _.map(this.games, game => {
            var retGame = game.getSummary(undefined, { fullData: true });
            retGame.password = game.password;

            return retGame;
        });

        logger.info('syncing', _.size(gameSummaries), ' games');

        callback(gameSummaries);
    }

    async onCloseGame(gameId) {
        var game = this.games[gameId];
        if(!game) {
            return;
        }

        delete this.games[gameId];
        await this.closeGame(game);
    }

    onCardData(cardData) {
        this.titleCardData = cardData.titleCardData;
        this.cardData = cardData.cardData;
        this.packData = cardData.packData;
        this.restrictedListData = cardData.restrictedListData;
    }

    async onConnection(ioSocket) {
        if(!ioSocket.request.user) {
            logger.info('socket connected with no user, disconnecting');
            ioSocket.disconnect();
            return;
        }

        let game = this.findGameForUser(ioSocket.request.user);
        if(!game) {
            try {
                game = await this.startNewGame(ioSocket.request.user);
            } catch(err) {
                logger.error('Error starting new game', err);
                ioSocket.disconnect();
                return;
            }
        }

        if(!game) {
            logger.info('No game for', ioSocket.request.user.username, 'disconnecting');
            ioSocket.disconnect();
            return;
        }

        let socket = new Socket(ioSocket, { config: config });
        let player = game.playersAndSpectators[socket.user.username];
        if(!player) {
            return;
        }

        player.lobbyId = player.id;
        player.id = socket.id;
        player.connectionSucceeded = true;
        if(player.disconnected) {
            logger.info('user \'%s\' reconnected to game', socket.user.username);
            game.reconnect(socket, player.name);
        }

        socket.joinChannel(game.id);

        player.socket = socket;

        if(!player.isSpectator()) {
            game.addMessage('{0} has connected to the game server', player);
        }

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));
    }

    async onSocketDisconnected(socket, reason) {
        let game = this.findGameForUser(socket.user);
        if(!game) {
            return;
        }

        logger.info('user \'%s\' disconnected from a game: %s', socket.user.username, reason);
        game.disconnect(socket.user.username);

        if(!socket.tIsClosing) {
            if(game.isEmpty()) {
                delete this.games[game.id];

                await this.closeGame(game);
            }
        }

        this.sendGameState(game);
    }

    async closeGame(game) {
        delete this.games[game.id];

        await this.redisClient.del(`game:${game.id}`);
        await this.redisClient.srem('games', game.id);
        await this.redisClient.publish('RemoveRunningGame', game.id);
    }

    async onLeaveGame(socket) {
        let game = this.findGameForUser(socket.user);
        if(!game) {
            return;
        }

        game.leave(socket.user.username);

        let state = game.getSaveState();

        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if(game.isEmpty()) {
            logger.info('Removing game', game.id);
            delete this.games[game.id];

            await this.closeGame(game);
        } else {
            await this.redisClient.set(`game:${game.id}`, JSON.stringify(state));
            await this.redisClient.publish('UpdateRunningGame', game.id);
        }

        this.sendGameState(game);
    }

    onGameMessage(socket, command, ...args) {
        let game = this.findGameForUser(socket.user);

        if(!game) {
            return;
        }

        if(command === 'leavegame') {
            return this.onLeaveGame(socket);
        }

        if(!game[command] || !_.isFunction(game[command])) {
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
