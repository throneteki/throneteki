const EventEmitter = require('events');
const redis = require('redis');
const config = require('config');
const logger = require('../log.js');
const { spawnSync } = require('child_process');

const { detectBinary } = require('../util');

class GameSocket extends EventEmitter {
    constructor(configService, listenAddress, protocol, version) {
        super();

        this.configService = configService;
        this.listenAddress = listenAddress;
        this.protocol = protocol;
        this.version = version;

        this.nodeName = process.env.SERVER || configService.getValue('nodeIdentity');

        this.redis = redis.createClient(configService.getValue('redisUrl'));
        this.subscriber = this.redis.duplicate();
        this.publisher = this.redis.duplicate();

        this.subscriber.on('error', this.onError);
        this.publisher.on('error', this.onError);

        this.subscriber.subscribe(this.nodeName);
        this.subscriber.subscribe('allnodes');
        this.subscriber.on('subscribe', this.onConnect.bind(this));
        this.subscriber.on('message', this.onMessage.bind(this));
    }

    send(command, arg) {
        let data = '';

        try {
            data = JSON.stringify({
                command: command,
                arg: arg,
                identity: this.nodeName
            });
        } catch (err) {
            logger.error('Failed to stringify node data %s', err);
            for (let obj of Object.values(detectBinary(arg))) {
                logger.error(`Path: ${obj.path}, Type: ${obj.type}`);
            }

            return;
        }

        this.publisher.publish('nodemessage', data);
    }

    onError(err) {
        logger.error('Redis error: %s', err);
    }

    onConnect(channel) {
        if (channel === 'allnodes') {
            this.emit('onGameSync', this.onGameSync.bind(this));
        }
    }

    onGameSync(games) {
        this.send('HELLO', {
            maxGames: config.maxGames,
            version: this.version,
            address: this.listenAddress,
            port:
                process.env.NODE_ENV === 'production'
                    ? 80
                    : process.env.PORT || config.socketioPort,
            protocol: this.protocol,
            games: games
        });
    }

    onMessage(channel, msg) {
        if (channel !== 'allnodes' && channel !== this.nodeName) {
            logger.warn(`Message '${msg}' received for unknown channel ${channel}`);
            return;
        }

        let message;
        try {
            message = JSON.parse(msg);
        } catch (err) {
            logger.info(
                `Error decoding redis message. Channel ${channel}, message '${msg}' %o`,
                err
            );
            return;
        }

        switch (message.command) {
            case 'PING':
                this.send('PONG');
                break;
            case 'STARTGAME':
                this.emit('onStartGame', message.arg);
                break;
            case 'SPECTATOR':
                this.emit('onSpectator', message.arg.game, message.arg.user);
                break;
            case 'CONNECTFAILED':
                this.emit('onFailedConnect', message.arg.gameId, message.arg.username);
                break;
            case 'CLOSEGAME':
                this.emit('onCloseGame', message.arg.gameId);
                break;
            case 'CARDDATA':
                this.emit('onCardData', message.arg);
                break;
            case 'LOBBYHELLO':
                this.emit('onGameSync', this.onGameSync.bind(this));
                break;
            case 'RESTART':
                logger.error('Got told to restart, executing pm2 restart..');
                spawnSync('pm2', ['restart', this.nodeName]);
                break;
        }
    }
}

module.exports = GameSocket;
