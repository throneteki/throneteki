const logger = require('../log');
const DeckService = require('./DeckService.js');

class EventService {
    constructor(db) {
        this.events = db.get('events');
        this.deckService = new DeckService(db);
    }

    async getEvents() {
        return this.events.find({})
            .then(event => {
                return event;
            })
            .catch(err => {
                logger.error('Error fetching events', err);

                throw new Error('Error occured fetching events');
            });
    }

    async getEventById(id) {
        return this.events.findOne({ _id: id });
    }

    async create(entry) {
        return this.events.insert(entry)
            .then(() => {
                return entry;
            })
            .catch(err => {
                logger.error('Error adding event', err, entry);

                throw new Error('Error occured adding event');
            });
    }

    async update(event) {
        const { id, ...properties } = event;

        return this.events.update({ _id: id }, { '$set': properties })
            .catch(err => {
                logger.error('Unable to update event', err);
                throw new Error('Unable to update event');
            });
    }

    async delete(id) {
        await this.deckService.removeEventIdAndUnlockDecks(id);
        return this.events.remove({ _id: id });
    }
}

module.exports = EventService;
