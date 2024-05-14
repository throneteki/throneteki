import logger from '../log.js';

class DeckService {
    constructor(db) {
        this.decks = db.get('decks');
    }

    getById(id) {
        return this.decks.findOne({ _id: id })
            .then(deck => {
                deck.locked = deck.eventId ? true : false; // lock the deck from further changes if the eventId is set //TODO refactor this when draft is finished
                return deck;
            })
            .catch(err => {
                logger.error('Unable to fetch deck %s', err);
                throw new Error('Unable to fetch deck ' + id);
            });
    }

    getByName(name) {
        return this.decks.findOne({ name })
            .then(deck => {
                deck.locked = deck.eventId ? true : false; // lock the deck from further changes if the eventId is set //TODO refactor this when draft is finished
                return deck;
            })
            .catch(err => {
                logger.error('Unable to fetch deck %s', err);
                throw new Error('Unable to fetch deck ' + name);
            });
    }

    getByStandaloneId(id) {
        return this.decks.findOne({ standaloneDeckId: id })
            .catch(err => {
                logger.error('Unable to fetch standalone deck %s', err);
                throw new Error('Unable to fetch standalone deck ' + id);
            });
    }

    findByUserName(username) {
        return this.decks.find({ username: username }, { sort: { lastUpdated: -1 } })
            .then(decks => {
                decks.forEach(d => d.locked = d.eventId ? true : false);
                return decks;
            });
    }

    removeEventIdAndUnlockDecks(eventId) {
        return this.decks.find({ eventId: eventId })
            .then(eventDecks => eventDecks.forEach(deck => {
                let properties = {
                    eventId: undefined
                };
                this.decks.update({ _id: deck._id }, { '$set': properties });
            }));
    }

    getStandaloneDecks() {
        return this.decks.find({ standaloneDeckId: { $exists: true } }, { sort: { lastUpdated: -1 } });
    }

    async create(deck) {
        //if the eventId is set on a new deck, check if the user already has a deck with the same eventId
        if(deck.eventId) {
            //if a deck for the event already exists, do not create the new deck
            if(await this.userAlreadyHasDeckForEvent(deck.username, deck.eventId)) {
                throw new Error(`User ${deck.username} already has a deck configured for event ${deck.eventId}`);
            }
        }
        
        let properties = {
            username: deck.username,
            name: deck.deckName,
            plotCards: deck.plotCards,
            bannerCards: deck.bannerCards,
            drawCards: deck.drawCards,
            eventId: deck.eventId,
            faction: deck.faction,
            agenda: deck.agenda,
            rookeryCards: deck.rookeryCards || [],
            lastUpdated: new Date()
        };

        return this.decks.insert(properties);
    }

    createStandalone(deck) {
        let properties = {
            name: deck.name,
            plotCards: deck.plotCards,
            bannerCards: deck.bannerCards,
            drawCards: deck.drawCards,
            faction: deck.faction,
            agenda: deck.agenda,
            rookeryCards: deck.rookeryCards || [],
            lastUpdated: deck.lastUpdated,
            standaloneDeckId: deck.standaloneDeckId
        };

        return this.decks.insert(properties);
    }

    async update(deck) {
        let previousVersion = await this.getById(deck.id);
        //do not save the deck if the deck is locked
        if(previousVersion.locked) {
            throw new Error('Locked decks can not be updated');
        }

        //if the eventId is set on the deck, check if the user already has a deck with the same eventId
        if(deck.eventId) {
            //if a deck for the event already exists, do not update the deck
            if(await this.userAlreadyHasDeckForEvent(previousVersion.username, deck.eventId)) {
                throw new Error(`User ${previousVersion.username } already has a deck configured for event ${deck.eventId}`);
            }
        }

        let properties = {
            name: deck.deckName,
            plotCards: deck.plotCards,
            drawCards: deck.drawCards,
            bannerCards: deck.bannerCards,
            faction: deck.faction,
            eventId: deck.eventId,
            agenda: deck.agenda,
            rookeryCards: deck.rookeryCards || [],
            lastUpdated: new Date()
        };

        return this.decks.update({ _id: deck.id }, { '$set': properties });
    }

    async delete(id) {
        let previousVersion = await this.getById(id);
        //do not delete the deck if the deck is locked
        if(previousVersion.locked) {
            throw new Error('Can not delete a locked deck');
        }
        return this.decks.remove({ _id: id });
    }

    async userAlreadyHasDeckForEvent(username, eventId) {
        let deckForEventAlreadyExists = await this.decks.findOne({ username: username, eventId: eventId })
            .catch(() => {
                throw new Error(`Unable to fetch deck with parameters ${username} and ${eventId}`);
            });
        return !!deckForEventAlreadyExists;
    }
}

export default DeckService;

