const logger = require('../log.js');

class DeckService {
    constructor(db) {
        this.decks = db.get('decks');
    }

    getById(id) {
        return this.decks.findOne({ _id: id })
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + id);
            });
    }

    getByName(name) {
        return this.decks.findOne({ name })
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + name);
            });
    }

    getByStandaloneId(id) {
        return this.decks.findOne({ standaloneDeckId: id })
            .catch(err => {
                logger.error('Unable to fetch standalone deck', err);
                throw new Error('Unable to fetch standalone deck ' + id);
            });
    }

    findByUserName(userName) {
        return this.decks.find({ username: userName }, { sort: { lastUpdated: -1 } });
    }

    getStandaloneDecks() {
        return this.decks.find({ standaloneDeckId: { $exists: true } }, { sort: { lastUpdated: -1 } });
    }

    async create(deck) {
        //if the eventId is set on a new deck, check if the user already has a deck with the same eventId
        if(deck.eventId) {
            //if a deck for the event already exists, do not create the new deck
            if(this.userAlreadyHasDeckForEvent(deck.userName, deck.eventId)) {
                return () => Promise.resolve();
            }
        }
        
        let properties = {
            username: deck.username,
            name: deck.deckName,
            plotCards: deck.plotCards,
            bannerCards: deck.bannerCards,
            drawCards: deck.drawCards,
            eventId: deck.eventId,
            locked: deck.eventId ? true : false, // lock the deck from further changes if the eventId is set
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
            return () => Promise.resolve();
        }

        //if the eventId is set on the deck, check if the user already has a deck with the same eventId
        if(deck.eventId) {
            //if a deck for the event already exists, do not update the deck
            if(this.userAlreadyHasDeckForEvent(deck.userName, deck.eventId)) {
                return () => Promise.resolve();
            }
        }

        let properties = {
            name: deck.deckName,
            plotCards: deck.plotCards,
            drawCards: deck.drawCards,
            bannerCards: deck.bannerCards,
            faction: deck.faction,
            eventId: deck.eventId,
            locked: deck.eventId ? true : false, // lock the deck from further changes if the eventId is set
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
            return () => Promise.resolve();
        }
        return this.decks.remove({ _id: id });
    }

    async userAlreadyHasDeckForEvent(userName, eventId) {
        let otherDecksForThisUser = await this.findByUserName(userName);
        let deckForEventAlreadyExists = otherDecksForThisUser.some(d => d.eventId === eventId);
        return deckForEventAlreadyExists;
    }
}

module.exports = DeckService;

