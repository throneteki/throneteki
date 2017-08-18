const logger = require('../log.js');
const monk = require('monk');

class DeckRepository {
    constructor(dbPath) {
        let db = monk(dbPath);
        this.decks = db.get('decks');
    }

    getById(id) {
        return this.decks.findOne({ _id: id })
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + id);
            });
    }
}

module.exports = DeckRepository;

