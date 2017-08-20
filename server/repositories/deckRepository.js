const logger = require('../log.js');
const mongoskin = require('mongoskin');

const BaseRepository = require('./baseRepository.js');

class DeckRepository extends BaseRepository {
    getById(id) {
        return new Promise((resolve, reject) => {
            this.db.collection('decks').findOne({ _id: mongoskin.helper.toObjectID(id) }, (err, deck) => {
                if(err) {
                    logger.error(err);
                    return reject(err);
                }

                return resolve(deck);
            });
        });
    }
}

module.exports = DeckRepository;

