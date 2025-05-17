import { GameFormats } from '../../client/constants.js';
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
        this.gameFormats = GameFormats.map((gf) => gf.name);
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

        formattedDeck.status = validateDeck(formattedDeck, {
            packs: this.packs,
            gameFormats: this.gameFormats,
            restrictedLists: this.restrictedLists
        });

        return formattedDeck;
    };

    async getById(id) {
        try {
            this.restrictedLists = await this.cardService.getRestrictedList();

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
        const sort = options.sorting || [{ id: 'lastUpdated', desc: 'true' }];
        const filter = options.filters || [];
        const page = parseInt(options.pageNumber, 10) || 1;
        const pageSize = parseInt(options.pageSize, 10) || 10;

        filter.push({ id: 'username', value: username });

        this.restrictedLists = await this.cardService.getRestrictedList();

        const baseMatch = {
            $and: filter.map((curr) => {
                if (Array.isArray(curr.value)) {
                    return {
                        $or: curr.value.map((val) => ({
                            [curr.id]: { $regex: val, $options: 'i' }
                        }))
                    };
                }
                return {
                    [curr.id]:
                        curr.id === 'username' ? curr.value : { $regex: curr.value, $options: 'i' }
                };
            })
        };

        const dbDecks = await this.decks.aggregate([
            {
                $facet: {
                    metadata: [
                        {
                            $match: baseMatch
                        },
                        { $count: 'totalCount' }
                    ],
                    data: [
                        {
                            $match: baseMatch
                        },
                        { $sort: { [sort[0].id]: sort[0].desc === 'true' ? -1 : 1 } },
                        { $skip: (page - 1) * pageSize },
                        { $limit: pageSize }
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

    async getStandaloneDecks(options = {}) {
        const sort = options.sorting || [{ id: 'lastUpdated', desc: 'true' }];
        const filter = options.filters || [];
        const page = parseInt(options.pageNumber, 10) || 1;
        const pageSize = parseInt(options.pageSize, 10) || 10;

        const baseMatch = {
            $and: [
                { standaloneDeckId: { $exists: true } },
                ...filter.map((curr) => {
                    if (Array.isArray(curr.value)) {
                        return {
                            $or: curr.value.map((val) => ({
                                [curr.id]: { $regex: val, $options: 'i' }
                            }))
                        };
                    }
                    return {
                        [curr.id]: { $regex: curr.value, $options: 'i' }
                    };
                })
            ]
        };
        const dbDecks = await this.decks.aggregate([
            {
                $facet: {
                    metadata: [{ $match: baseMatch }, { $count: 'totalCount' }],
                    data: [
                        { $match: baseMatch },
                        { $sort: { [sort[0].id]: sort[0].desc === 'true' ? -1 : 1 } },
                        { $skip: (page - 1) * pageSize },
                        { $limit: pageSize }
                    ]
                }
            }
        ]);

        return {
            totalCount: dbDecks[0].metadata[0].totalCount,
            page,
            pageSize,
            success: true,
            data: dbDecks[0].data.map((deck) => this.processDeck(deck))
        };
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
            isFavourite: deck.isFavourite,
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
