import logger from '../log.js';
import DeckService from './DeckService.js';
import CardService from './CardService.js';
class EventService {
    constructor(db) {
        this.events = db.get('events');
        this.cardService = new CardService(db);
        this.deckService = new DeckService(db, this.cardService);
    }

    async init() {
        await this.deckService.init();
    }

    async getEvents() {
        return this.events
            .find({})
            .then((event) => {
                return event;
            })
            .catch((err) => {
                logger.error('Error fetching events %s', err);

                throw new Error('Error occured fetching events');
            });
    }

    async getEventById(id) {
        return this.events.findOne({ _id: id });
    }

    async create(entry) {
        return this.events
            .insert(entry)
            .then(() => {
                return entry;
            })
            .catch((err) => {
                logger.error('Error adding event %s %s', err, entry);

                throw new Error('Error occured adding event');
            });
    }

    async update(event) {
        const { id, ...properties } = event;

        return this.events.update({ _id: id }, { $set: properties }).catch((err) => {
            logger.error('Unable to update event %s', err);
            throw new Error('Unable to update event');
        });
    }

    async delete(id) {
        await this.deckService.removeEventIdAndUnlockDecks(id);
        return this.events.remove({ _id: id });
    }
}

export default EventService;
