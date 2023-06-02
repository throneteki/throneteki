const EventEmitter = require('events');
const zmq = require('zeromq');
const config = require('config');
const logger = require('../log.js');
const { spawnSync } = require('child_process');

class ZmqSocket extends EventEmitter {
    constructor(listenAddress, protocol, version) {
        super();

        this.listenAddress = listenAddress;
        this.protocol = protocol;
        this.version = version;

        this.socket = zmq.socket('dealer');
        this.socket.identity = process.env.SERVER || config.nodeIdentity;
        this.socket.monitor(500, 0);

        this.socket.connect(`tcp://${config.mqHost}:${config.mqPort}`, (err) => {
            if (err) {
                logger.info(err);
            }
        });

        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
    }

    send(command, arg) {
        this.socket.send(JSON.stringify({ command: command, arg: arg }));
    }

    onConnect() {
        this.emit('onGameSync', this.onGameSync.bind(this));
    }

    onGameSync(games) {
        this.send('HELLO2', {
            maxGames: config.maxGames,
            version: this.version,
            url: `${this.protocol}://${this.listenAddress}:${
                process.env.NODE_ENV === 'production' ? 80 : process.env.PORT || config.socketioPort
            }`,
            games: games
        });
    }

    onMessage(x, msg) {
        var message = undefined;

        try {
            message = JSON.parse(msg.toString());
        } catch (err) {
            logger.info(err);
            return;
        }

        switch (message.command) {
            case 'PING2':
                this.send('PONG2');
                break;
            case 'STARTGAME2':
                this.emit('onStartGame', message.arg);
                break;
            case 'SPECTATOR2':
                this.emit('onSpectator', message.arg.game, message.arg.user);
                break;
            case 'CONNECTFAILED2':
                this.emit('onFailedConnect', message.arg.gameId, message.arg.username);
                break;
            case 'CLOSEGAME2':
                this.emit('onCloseGame', message.arg.gameId);
                break;
            case 'CARDDATA2':
                this.emit('onCardData', message.arg);
                break;
            case 'RESTART2':
                logger.error('Got told to restart, executing pm2 restart..');
                spawnSync('pm2', ['restart', this.socket.identity]);
                break;
        }
    }
}

module.exports = ZmqSocket;
