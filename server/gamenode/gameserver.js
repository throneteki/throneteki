const os = require('os');
const interfaces = os.networkInterfaces();
const _ = require('underscore');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

const config = require('./nodeconfig.js');
const logger = require('../log.js');
const ZmqSocket = require('./zmqsocket.js');
const Game = require('../game/game.js');
const Socket = require('../socket.js');

class GameServer {
    constructor() {
        this.listenAddress = this.getNetworkAddress();
        this.games = {};
        this.sockets = {};

        this.socket = new ZmqSocket(this.listenAddress);
        this.socket.on('onStartGame', this.onStartGame.bind(this));

        this.io = socketio();
        this.io.listen(config.socketioPort);
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));
    }

    getNetworkAddress() {
        var firstAddress = undefined;

        _.each(interfaces, addresses => {
            _.each(addresses, address => {
                if(address.family !== 'IPv4' || address.internal || firstAddress) {
                    return;
                }

                firstAddress = address.address;
            });
        });

        return firstAddress;
    }

    findGameForUser(username) {
        return _.find(this.games, game => {
            return game.playersAndSpectators[username];
        });
    }

    sendGameState(game) {
        _.each(game.getPlayersAndSpectators(), player => {
            this.sockets[player.id].send('gamestate', game.getState(player.name));
        });
    }

    handshake(socket, next) {
        if(socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, config.secret, function(err, user) {
                if(err) {
                    logger.info(err);
                    return;
                }

                socket.request.user = user;
            });
        }

        next();
    }

    onStartGame(pendingGame) {
        var game = new Game(pendingGame);
        this.games[pendingGame.id] = game;

        game.started = true;
        _.each(pendingGame.players, player => {
            game.selectDeck(player.name, player.deck);
        });

        game.initialise();

        logger.info('Starting new game', game.id);
    }

    onConnection(ioSocket) {
        if(!ioSocket.request.user) {
            ioSocket.disconnect();
            return;
        }

        var game = this.findGameForUser(ioSocket.request.user.username);
        if(!game) {
            ioSocket.disconnect();
            return;
        }

        var socket = new Socket(ioSocket);
        game.playersAndSpectators[socket.user.username].id = socket.id;

        socket.joinChannel(game.id);

        this.sockets[socket.id] = socket;

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
     //   socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;
    }

    onGameMessage(socket, command, ...args) {
        var game = this.findGameForUser(socket.user.username);

        if(!game || !game[command] || !_.isFunction(game[command])) {
            return;
        }

        game[command](socket.user.username, ...args);

        game.continue();

        this.sendGameState(game);
    }
}

module.exports = GameServer;
