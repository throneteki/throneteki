const logger = require('../log.js');

const BaseRepository = require('./baseRepository.js');

class MessageRepository extends BaseRepository {
    addMessage(message) {
        return this.db.collection('messages').insert(message, err => {
            if(err) {
                logger.error(err);
            }
        });
    }

    getLastMessages() {
        return new Promise((resolve, reject) => {
            this.db.collection('messages').find({}, { limit: 150, sort: { time: -1 } }).toArray((err, messages) => {
                if(err) {
                    return reject(err);
                }

                return resolve(messages);
            });
        });
    }
}

module.exports = MessageRepository;
