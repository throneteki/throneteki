const EventEmitter = require('events');
const logger = require('../log.js');

class MessageService extends EventEmitter {
    constructor(db) {
        super();

        this.messages = db.get('messages');
    }

    addMessage(message) {
        return this.messages.insert(message)
            .catch(err => {
                logger.error('Unable to insert message', err);
                throw new Error('Unable to insert message');
            });
    }

    getLastMessages() {
        return this.messages.find({}, { limit: 100, sort: { time: -1 } });
    }

    removeMessage(messageId) {
        return this.messages.remove({ _id: messageId }).then(() => {
            this.emit('messageDeleted', messageId);
        });
    }

    getMotdMessage() {
        return this.messages.find({ type: 'motd' });
    }

    setMotdMessage(message) {
        return this.messages.count({ type: 'motd' }).then(count => {
            if(count > 0) {
                return this.messages.update({
                    type: 'motd'
                }, {
                    '$set': {
                        message: message.message,
                        user: message.user,
                        time: message.time,
                        motdType: message.motdType
                    }
                });
            }

            return this.messages.insert(message);
        });
    }
}

module.exports = MessageService;
