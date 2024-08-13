import EventEmitter from 'events';
import logger from '../log.js';

class MessageService extends EventEmitter {
    constructor(db) {
        super();

        this.messages = db.get('messages');
    }

    addMessage(message) {
        return this.messages.insert(message).catch((err) => {
            logger.error('Unable to insert message %s', err);
            throw new Error('Unable to insert message');
        });
    }

    async getLastMessages(isModerator) {
        const messages = await this.messages.find(
            { type: { $ne: 'motd' } },
            { limit: 100, sort: { time: -1 } }
        );

        return messages.map((message) => {
            return {
                _id: message._id,
                user: message.user,
                message: !message.deleted || isModerator ? message.message : undefined,
                time: message.time,
                deleted: message.deleted,
                deletedBy: isModerator ? message.deletedBy : undefined
            };
        });
    }

    removeMessage(messageId, deletedBy) {
        return this.messages
            .update({ _id: messageId }, { $set: { deleted: true, deletedBy } })
            .then(() => {
                this.emit('messageDeleted', messageId);
            });
    }

    getMotdMessage() {
        return this.messages.find({ type: 'motd' });
    }

    setMotdMessage(message) {
        return this.messages.findOneAndUpdate(
            { type: 'motd' },
            {
                $set: {
                    message: message.message,
                    user: message.user,
                    time: message.time,
                    motdType: message.motdType
                }
            },
            { upsert: true, new: true }
        );
    }
}

export default MessageService;
