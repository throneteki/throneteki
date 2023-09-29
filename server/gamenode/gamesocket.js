const EventEmitter = require('events');
const redis = require('redis');

const logger = require('../log.js');
const version = require('../../version.js');
const { detectBinary } = require('../util');

class GameSocket extends EventEmitter {
    constructor(configService, protocol) {
        super();

        this.configService = configService;

        const listenAddress = configService.getValueForSection('gameNode', 'host');

        (this.url = `${protocol}://${listenAddress}:${
            process.env.NODE_ENV === 'production'
                ? 80
                : process.env.PORT || configService.getValueForSection('gameNode', 'socketioPort')
        }`),
            (this.version = version.build);

        this.nodeName = process.env.SERVER || configService.getValueForSection('gameNode', 'name');

        this.redisClient = redis.createClient({
            url: configService.getValue('redisUrl')
        });
    }

    async init() {
        await this.redisClient.connect();

        this.subscriber = this.redisClient.duplicate();
        this.publisher = this.redisClient.duplicate();

        this.publisher.on('ready', this.onReady.bind(this));

        await Promise.all([this.subscriber.connect(), this.publisher.connect()]);
        this.redisClient.on('error', this.onError);
        this.subscriber.on('error', this.onError);
        this.publisher.on('error', this.onError);

        const commands = ['LOBBYHELLO2', 'STARTGAME2', 'PING2', 'CLOSEGAME2'];

        for (let command of commands) {
            this.subscriber.subscribe(command, this.onMessage.bind(this, command));
        }

        //        this.subscriber.subscribe(this.nodeName);
        //      this.subscriber.subscribe('allnodes');
        //     this.subscriber.on('subscribe', this.onConnect.bind(this));
        //    this.subscriber.on('message', this.onMessage.bind(this));

        let cards = await this.redisClient.get('data:cards');
        let packs = await this.redisClient.get('data:packs');
        this.emit('onCardData', { cards: JSON.parse(cards), packs: JSON.parse(packs) });
    }

    onError(err) {
        logger.error('Redis error: ', err);
    }

    onReady() {
        this.emit('onGameSync', this.onGameSync.bind(this));
    }

    onMessage(command, msg) {
        let message;
        try {
            message = JSON.parse(msg);
        } catch (err) {
            logger.info(
                `Error decoding redis message. Channel ${command}, message '${msg}' %o`,
                err
            );
            return;
        }

        if (message.target !== 'allnodes' && message.target !== this.nodeName) {
            return;
        }

        switch (command) {
            case 'PING2':
                this.send('PONG2');
                break;
            case 'STARTGAME2':
                this.emit('onStartGame', message.arg);
                break;
            case 'SPECTATOR2':
                this.emit('onSpectator', message.game, message.user);
                break;
            case 'CONNECTFAILED2':
                this.emit('onFailedConnect', message.gameId, message.username);
                break;
            case 'CLOSEGAME2':
                this.emit('onCloseGame', message.gameId);
                break;
            //            case 'RESTART':
            //              logger.error('Got told to restart, executing pm2 restart..');
            //          spawnSync('pm2', ['restart', this.nodeName]);
            //            break;
            case 'LOBBYHELLO2':
                this.emit('onGameSync', this.onGameSync.bind(this));
                break;
        }
    }

    onGameSync(games) {
        this.send('HELLO2', {
            maxGames: this.configService.getValueForSection('gameNode', 'maxGames'),
            version: this.version,
            url: this.url,
            games: games
        });
    }

    send(command, arg) {
        let data = '';

        try {
            data = JSON.stringify({
                arg: arg,
                source: this.nodeName
            });
        } catch (err) {
            logger.error('Failed to stringify node data', err);
            for (let obj of Object.values(detectBinary(arg))) {
                logger.error(`Path: ${obj.path}, Type: ${obj.type}`);
            }

            return;
        }

        this.publisher.publish(command, data);
    }
}

module.exports = GameSocket;
