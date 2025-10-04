import _ from 'underscore';
import { Server as socketio } from 'socket.io';
import jwt from 'jsonwebtoken';
import Sentry from '@sentry/node';
import http from 'http';
import https from 'https';
import fs from 'fs';
import config from 'config';
import { detectBinary } from '../util.js';
import logger from '../log.js';
import GameSocket from './gamesocket.js';
import Game from '../game/game.js';
import Socket from '../socket.js';
import ConfigService from '../services/ConfigService.js';
import TextHelper from '../game/TextHelper.js';

if (config.sentryDsn) {
    Sentry.init({
        dsn: config.sentryDsn,
        release: process.env.VERSION || 'Local build',
        includeLocalVariables: true
    });
}

class GameServer {
    constructor() {
        this.configService = new ConfigService();
        this.games = {};

        this.protocol = 'https';

        try {
            var privateKey = fs.readFileSync(config.keyPath).toString();
            var certificate = fs.readFileSync(config.certPath).toString();
        } catch (e) {
            this.protocol = 'http';
        }

        this.host = process.env.HOST || config.host || undefined;

        this.gameSocket = new GameSocket(
            this.configService,
            this.host,
            this.protocol,
            process.env.VERSION || 'Local build'
        );
        this.gameSocket.on('onStartGame', this.onStartGame.bind(this));
        this.gameSocket.on('onSpectator', this.onSpectator.bind(this));
        this.gameSocket.on('onGameSync', this.onGameSync.bind(this));
        this.gameSocket.on('onFailedConnect', this.onFailedConnect.bind(this));
        this.gameSocket.on('onCloseGame', this.onCloseGame.bind(this));
        this.gameSocket.on('onCardData', this.onCardData.bind(this));

        var server = undefined;

        if (!privateKey || !certificate) {
            server = http.createServer();
        } else {
            server = https.createServer({ key: privateKey, cert: certificate });
        }

        const that = this;
        server.listen(process.env.PORT || config.socketioPort, function onStart(err) {
            if (err) {
                logger.error(err);
            }

            logger.info(
                `==> Listening on ${that.protocol}://${that.host || 'localhost'}:${process.env.PORT || config.socketioPort}/.`
            );
        });

        var options = {
            perMessageDeflate: false
        };

        if (process.env.NODE_ENV !== 'production') {
            options.path = '/' + (process.env.SERVER || config.nodeIdentity) + '/socket.io';
        }

        const corsOrigin = config.origin;
        if (corsOrigin) {
            options.cors = { origin: corsOrigin };
        }

        this.io = new socketio(server, options);
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
                    disconnected: player.disconnected,
                    longDisconnected: player.longDisconnected,
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

        Sentry.configureScope((scope) => {
            scope.setExtra('extra', debugData);
        });
        Sentry.captureException(e);

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
        this.gameSocket.send('GAMECLOSED', { game: game.id });
    }

    clearStaleAndFinishedGames() {
        // 20 minutes
        const timeout = 20 * 60 * 1000;
        // 1 minute remaining
        const warning = 1 * 60 * 1000;

        for (const game of Object.values(this.games)) {
            if (game.finishedAt) {
                const timeElapsed = Date.now() - game.finishedAt;
                if (timeElapsed > timeout) {
                    game.addAlert('warning', 'Game has closed');
                    logger.info('closed finished game %s due to inactivity', game.id);
                    this.sendGameState(game);
                    this.closeGame(game);
                    return;
                }
                // Sends a warning to game before closing due to timeout
                if (timeElapsed > timeout - warning) {
                    const timeRemaining = timeout - timeElapsed;
                    game.addAlert(
                        'warning',
                        'Game will close in {0}',
                        TextHelper.duration(timeRemaining / 1000)
                    );
                    this.sendGameState(game);
                    return;
                }
            }

            if (game.isEmpty()) {
                logger.info('closed empty game %s', game.id);
                this.closeGame(game);
            }
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
            if (player.left || game.isDisconnected(player) || !player.socket) {
                return;
            }

            player.socket.send('gamestate', game.getState(player.name));
        });
    }

    handshake(socket, next) {
        if (socket.handshake.auth.token && socket.handshake.auth.token !== 'undefined') {
            jwt.verify(socket.handshake.auth.token, config.secret, function (err, user) {
                if (err) {
                    return;
                }

                socket.request.user = user;
            });
        }

        next();
    }

    gameOver(game) {
        this.gameSocket.send('GAMEOVER', {
            game: game.getSaveState()
        });
    }

    rematch(game) {
        this.gameSocket.send('REMATCH', { game: game.getSaveState() });

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
        game.on('sendGameState', () => {
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

            this.gameSocket.send('GAMECLOSED', { game: game.id });
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
        this.gameSocket.send('GAMECLOSED', { game: game.id });
    }

    onCardData(cardData) {
        this.titleCardData = cardData.titleCardData;
        this.cardData = cardData.cardData;
        this.packData = cardData.packData;
        this.restrictedListData = cardData.restrictedListData;
    }

    onConnection(ioSocket) {
        if (!ioSocket.request.user) {
            logger.info('socket connected with no user, disconnecting');
            ioSocket.disconnect();
            return;
        }

        ioSocket.on('ping', (cb) => {
            if (typeof cb === 'function') cb();
        });

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
        if (!player.isSpectator()) {
            if (game.isDisconnected(player)) {
                logger.info("user '%s' reconnected to game", socket.user.username);
                game.reconnect(socket, player.name);
            } else {
                game.addAlert('info', '{0} has connected to the game server', player);
            }
        }

        socket.joinChannel(game.id);

        player.socket = socket;

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

                this.gameSocket.send('GAMECLOSED', { game: game.id });
            } else if (isSpectator) {
                this.gameSocket.send('PLAYERLEFT', {
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

        this.gameSocket.send('PLAYERLEFT', {
            gameId: game.id,
            game: game.getSaveState(),
            player: socket.user.username,
            spectator: isSpectator
        });

        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if (game.isEmpty()) {
            delete this.games[game.id];

            this.gameSocket.send('GAMECLOSED', { game: game.id });
        }
    }

    onGameMessage(socket, command, ...args) {
        var game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        this.runAndCatchErrors(game, () => {
            if (command === 'leavegame') {
                this.onLeaveGame(socket);
            } else if (!game[command] || !_.isFunction(game[command])) {
                return;
            } else {
                game[command](socket.user.username, ...args);
            }

            if (!game.isEmpty(false)) {
                game.continue();
            }

            this.sendGameState(game);
        });
    }
}

export default GameServer;
