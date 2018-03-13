const logger = require('./log.js');
const EventEmitter = require('events');
const jwt = require('jsonwebtoken');
const Raven = require('raven');
const UserService = require('./services/UserService');

class Socket extends EventEmitter {
    constructor(socket, options = {}) {
        super();

        this.socket = socket;
        this.user = socket.request.user;
        this.config = options.config;
        this.userService = options.userService || new UserService(options.db);

        socket.on('error', this.onError.bind(this));
        socket.on('authenticate', this.onAuthenticate.bind(this));
        socket.on('disconnect', this.onDisconnect.bind(this));
    }

    get id() {
        return this.socket.id;
    }

    // Commands
    registerEvent(event, callback) {
        this.socket.on(event, this.onSocketEvent.bind(this, callback));
    }

    joinChannel(channelName) {
        this.socket.join(channelName);
    }

    leaveChannel(channelName) {
        this.socket.leave(channelName);
    }

    send(message, ...args) {
        this.socket.emit(message, ...args);
    }

    disconnect() {
        this.socket.disconnect();
    }

    // Events
    onSocketEvent(callback, ...args) {
        if(!this.user) {
            return;
        }

        try {
            callback(this, ...args);
        } catch(err) {
            logger.info(err);
            Raven.captureException(err, { extra: args });
        }
    }

    onAuthenticate(token) {
        jwt.verify(token, this.config.secret, (err, user) => {
            if(err) {
                return;
            }

            this.userService.getUserById(user._id).then(dbUser => {
                delete dbUser.password;

                this.socket.request.user = dbUser;
                this.user = dbUser;

                this.emit('authenticate', this, user);
            }).catch(err => {
                logger.error(err);
            });
        });
    }

    onDisconnect(reason) {
        this.emit('disconnect', this, reason);
    }

    onError(err) {
        logger.info('Socket.IO error', err, '. Socket ID ', this.socket.id);
    }
}

module.exports = Socket;
