import { formatDeckAsFullCards } from '../../deck-helper/formatDeckAsFullCards.js';
import { validateDeck } from '../../deck-helper/index.js';
import logger from '../log.js';

class DeckService {
    constructor(db, cardService) {
        this.decks = db.get('decks');
        this.cardService = cardService;
    }

    async init() {
        this.packs = await this.cardService.getAllPacks();
        this.restrictedLists = await this.cardService.getRestrictedList();
        this.cards = await this.cardService.getAllCards();
    }

    processDeck = (deck) => {
        let formattedDeck = formatDeckAsFullCards(deck, {
            cards: this.cards,
            factions: this.factions
        });
        //copy over the locked properties from the server deck object
        formattedDeck.lockedForEditing = deck.lockedForEditing;
        formattedDeck.lockedForDeletion = deck.lockedForDeletion;

        formattedDeck.status = {};

        for (const restrictedList of this.restrictedLists) {
            formattedDeck.status[restrictedList._id] = validateDeck(formattedDeck, {
                packs: this.packs,
                restrictedLists: [restrictedList]
            });
        }

        return formattedDeck;
    };

    async getById(id) {
        try {
            const deck = await this.decks.findOne({ _id: id });
            if (!deck) {
                return null;
            }

            deck.locked = !!deck.eventId; // lock the deck from further changes if the eventId is set //TODO refactor this when draft is finished

            return this.processDeck(deck);
        } catch (err) {
            logger.error('Unable to fetch deck %s', err);
            throw new Error('Unable to fetch deck ' + id);
        }
    }

    getByName(name) {
        return this.decks
            .findOne({ name })
            .then((deck) => {
                deck.locked = deck.eventId ? true : false; // lock the deck from further changes if the eventId is set //TODO refactor this when draft is finished
                return deck;
            })
            .catch((err) => {
                logger.error('Unable to fetch deck %s', err);
                throw new Error('Unable to fetch deck ' + name);
            });
    }

    getByStandaloneId(id) {
        return this.decks.findOne({ standaloneDeckId: id }).catch((err) => {
            logger.error('Unable to fetch standalone deck %s', err);
            throw new Error('Unable to fetch standalone deck ' + id);
        });
    }

    async findByUserName(username, options = {}) {
        const sort = options.sorting || ['lastUpdated', 'true'];
        const page = parseInt(options.pageNumber, 10) || 1;
        const pageSize = parseInt(options.pageSize, 10) || 10;

        const dbDecks = await this.decks.aggregate([
            {
                $facet: {
                    metadata: [{ $match: { username: username } }, { $count: 'totalCount' }],
                    data: [
                        { $match: { username: username } },
                        { $skip: (page - 1) * pageSize },
                        { $limit: pageSize },
                        { $sort: { [sort[0]]: sort[1] === 'true' ? -1 : 1 } }
                    ]
                }
            }
        ]);

        if (dbDecks.length === 0 || dbDecks[0].metadata.length === 0) {
            return { success: true, data: [], totalCount: 0, page, pageSize };
        }

        const decks = Object.assign(
            { totalCount: dbDecks[0].metadata[0].totalCount, page, pageSize },
            {
                success: true,
                data: dbDecks[0].data.map((deck) => {
                    deck.locked = !!deck.eventId;

                    deck = this.processDeck(deck);

                    return deck;
                })
            }
        );

        return decks;
    }

    removeEventIdAndUnlockDecks(eventId) {
        return this.decks.find({ eventId: eventId }).then((eventDecks) =>
            eventDecks.forEach((deck) => {
                let properties = {
                    eventId: undefined
                };
                this.decks.update({ _id: deck._id }, { $set: properties });
            })
        );
    }

    async getStandaloneDecks() {
        const decks = await this.decks.find(
            { standaloneDeckId: { $exists: true } },
            { sort: { lastUpdated: -1 } }
        );

        return decks.map((deck) => this.processDeck(deck));
    }

    async create(deck) {
        //if the eventId is set on a new deck, check if the user already has a deck with the same eventId
        if (deck.eventId) {
            //if a deck for the event already exists, do not create the new deck
            if (await this.userAlreadyHasDeckForEvent(deck.username, deck.eventId)) {
                throw new Error(
                    `User ${deck.username} already has a deck configured for event ${deck.eventId}`
                );
            }
        }

        let properties = {
            username: deck.username,
            name: deck.name,
            plotCards: deck.plotCards,
            bannerCards: deck.bannerCards,
            drawCards: deck.drawCards,
            eventId: deck.eventId,
            faction: deck.faction,
            agenda: deck.agenda,
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
            lastUpdated: deck.lastUpdated,
            standaloneDeckId: deck.standaloneDeckId
        };

        return this.decks.insert(properties);
    }

    async update(deck) {
        let previousVersion = await this.getById(deck.id);
        //do not save the deck if the deck is locked
        if (previousVersion.locked) {
            throw new Error('Locked decks can not be updated');
        }

        //if the eventId is set on the deck, check if the user already has a deck with the same eventId
        if (deck.eventId) {
            //if a deck for the event already exists, do not update the deck
            if (await this.userAlreadyHasDeckForEvent(previousVersion.username, deck.eventId)) {
                throw new Error(
                    `User ${previousVersion.username} already has a deck configured for event ${deck.eventId}`
                );
            }
        }

        let properties = {
            name: deck.name,
            plotCards: deck.plotCards,
            drawCards: deck.drawCards,
            bannerCards: deck.bannerCards,
            faction: deck.faction,
            eventId: deck.eventId,
            agenda: deck.agenda,
            lastUpdated: new Date()
        };

        return this.decks.update({ _id: deck.id }, { $set: properties });
    }

    async delete(id) {
        let previousVersion = await this.getById(id);
        //do not delete the deck if the deck is locked
        if (previousVersion.locked) {
            throw new Error('Can not delete a locked deck');
        }
        return this.decks.remove({ _id: id });
    }

    async userAlreadyHasDeckForEvent(username, eventId) {
        let deckForEventAlreadyExists = await this.decks
            .findOne({ username: username, eventId: eventId })
            .catch(() => {
                throw new Error(`Unable to fetch deck with parameters ${username} and ${eventId}`);
            });
        return !!deckForEventAlreadyExists;
    }
}

export default DeckService;
