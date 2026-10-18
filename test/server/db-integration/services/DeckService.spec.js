import db, { resetDatabase } from '../helpers/database.js';
import CardService from '../../../../server/services/CardService.js';
import DeckService, { deckCardRows } from '../../../../server/services/DeckService.js';
import EventService from '../../../../server/services/EventService.js';
import UserService from '../../../../server/services/UserService.js';

const cards = [
    { code: '01001', name: 'A Clash of Kings', label: 'A Clash of Kings', type: 'plot' },
    { code: '01002', name: 'A Feast for Crows', label: 'A Feast for Crows', type: 'plot' },
    { code: '01027', name: 'Fealty', label: 'Fealty', type: 'agenda' },
    { code: '01198', name: 'Banner of the Stag', label: 'Banner of the Stag', type: 'agenda' },
    { code: '01028', name: 'Littlefinger', label: 'Littlefinger', type: 'character' },
    { code: '01206', name: 'Master of Whispers', label: 'Master of Whispers', type: 'title' }
];

const packs = [
    { code: 'TtB', name: 'Taking the Black', releaseDate: '2016-02-11' },
    { code: 'Core', name: 'Core Set', releaseDate: '2015-10-08' }
];

function newDeck(overrides = {}) {
    return {
        username: 'Stark',
        name: 'Winter is Coming',
        format: 'joust',
        variant: 'standard',
        faction: { name: 'House Stark', value: 'stark' },
        agenda: '01027',
        bannerCards: [],
        plotCards: [
            { cardcode: '01001', count: 1 },
            { cardcode: '01002', count: 1 }
        ],
        drawCards: [{ cardcode: '01028', count: 3 }],
        ...overrides
    };
}

describe('Postgres deck, card and event services', function () {
    beforeEach(async function () {
        await resetDatabase();

        this.userService = new UserService({ getValue: () => 'test-secret' });
        this.cardService = new CardService();
        this.eventService = new EventService();
        this.deckService = new DeckService(this.cardService, this.eventService);

        await this.cardService.replaceCards(cards);
        await this.cardService.replacePacks(packs);
        await this.deckService.init();

        for (const [username, email] of [
            ['Stark', 'ned@winterfell.example'],
            ['Lannister', 'tywin@casterly.example']
        ]) {
            await this.userService.addUser({ username, email, password: 'hash', verified: true });
        }
    });

    describe('CardService', function () {
        it('should return cards by code and title cards', async function () {
            const allCards = await this.cardService.getAllCards();

            expect(Object.keys(allCards).sort()).toEqual(cards.map((card) => card.code).sort());
            expect(allCards['01028'].name).toBe('Littlefinger');
            expect(Object.keys(await this.cardService.getTitleCards())).toEqual(['01206']);
        });

        it('should replace the cards entirely', async function () {
            await this.cardService.replaceCards([cards[0]]);

            expect(Object.keys(await this.cardService.getAllCards())).toEqual(['01001']);
        });

        it('should return packs in release order', async function () {
            const result = await this.cardService.getAllPacks();

            expect(result.map((pack) => pack.code)).toEqual(['Core', 'TtB']);
        });
    });

    describe('EventService', function () {
        it('should create, read, update and delete events', async function () {
            const created = await this.eventService.create({
                _id: undefined,
                name: 'Winter Tournament',
                format: 'joust',
                variant: 'standard',
                legality: 'latest',
                lockDecks: true,
                useEventGameOptions: true,
                eventGameOptions: { spectators: false, gameTimeLimit: 55 },
                validTableCreators: ['admin'],
                validSpectators: null
            });

            expect(created._id).toEqual(jasmine.any(String));

            let event = await this.eventService.getEventById(created._id);
            expect(event).toEqual(
                jasmine.objectContaining({
                    name: 'Winter Tournament',
                    legality: 'latest',
                    lockDecks: true,
                    eventGameOptions: { spectators: false, gameTimeLimit: 55 },
                    validTableCreators: ['admin'],
                    validSpectators: null
                })
            );

            await this.eventService.update({
                _id: created._id,
                name: 'Summer Tournament',
                legality: { _id: 'custom-list' },
                validSpectators: []
            });

            event = await this.eventService.getEventById(created._id);
            expect(event.name).toBe('Summer Tournament');
            expect(event.legality).toEqual({ _id: 'custom-list' });
            expect(event.validSpectators).toEqual([]);
            expect(event.lockDecks).toBe(true);

            await this.eventService.delete(created._id);
            expect(await this.eventService.getEvents()).toEqual([]);
        });
    });

    describe('DeckService', function () {
        it('should store a deck and return it in the MongoDB document shape', async function () {
            const created = await this.deckService.create(newDeck({ isFavourite: true }));

            const deck = await this.deckService.getById(created._id);

            expect(deck).toEqual(
                jasmine.objectContaining({
                    _id: created._id,
                    username: 'Stark',
                    name: 'Winter is Coming',
                    faction: { name: 'House Stark', value: 'stark' },
                    agenda: '01027',
                    bannerCards: [],
                    plotCards: [
                        { cardcode: '01001', count: 1 },
                        { cardcode: '01002', count: 1 }
                    ],
                    drawCards: [{ cardcode: '01028', count: 3 }],
                    locked: false,
                    lastUpdated: jasmine.any(Date)
                })
            );
            expect('pool' in deck).toBe(false);
            expect('eventId' in deck).toBe(false);
        });

        it('should validate a deck when given a format to check it against', async function () {
            const created = await this.deckService.create(newDeck());

            const deck = await this.deckService.getById(created._id, {
                format: 'joust',
                variant: 'standard',
                legality: 'latest'
            });

            expect(deck.status).toEqual(jasmine.objectContaining({ basicRules: false }));
        });

        it('should store card lists given as full cards, as MongoDB once did', function () {
            const rows = deckCardRows({
                plotCards: [{ card: { code: '01001' }, count: 1 }],
                drawCards: [
                    { card: { code: '01028' }, count: 2 },
                    { cardcode: '01029', count: 0 }
                ],
                bannerCards: [{ code: '01198' }, '01198'],
                pool: [{ card: '01206', count: 1 }]
            });

            expect(rows).toEqual([
                { section: 'plot', position: 0, card_code: '01001', count: 1 },
                { section: 'draw', position: 0, card_code: '01028', count: 2 },
                { section: 'banner', position: 0, card_code: '01198', count: 1 },
                { section: 'banner', position: 1, card_code: '01198', count: 1 },
                { section: 'pool', position: 0, card_code: '01206', count: 1 }
            ]);
        });

        it('should update a deck, keeping the favourite flag unless it is given', async function () {
            const created = await this.deckService.create(newDeck());
            await this.deckService.update({ ...newDeck({ isFavourite: true }), id: created._id });

            await this.deckService.update({
                ...newDeck({ name: 'Renamed', drawCards: [{ cardcode: '01028', count: 1 }] }),
                id: created._id
            });

            const deck = await this.deckService.getById(created._id);
            expect(deck.name).toBe('Renamed');
            expect(deck.drawCards).toEqual([{ cardcode: '01028', count: 1 }]);
            expect(deck.isFavourite).toBe(true);
        });

        it('should page, filter and sort a user’s decks', async function () {
            await this.deckService.create(newDeck({ name: 'Alpha' }));
            await this.deckService.create(newDeck({ name: 'Bravo', agenda: '01198' }));
            await this.deckService.create(
                newDeck({ name: 'Charlie', faction: { name: 'House Tyrell', value: 'tyrell' } })
            );
            await this.deckService.create(newDeck({ username: 'Lannister', name: 'Delta' }));

            let result = await this.deckService.findByUserName('stark', {
                sorting: [{ id: 'name', desc: 'false' }],
                pageSize: '2',
                pageNumber: '2'
            });
            expect(result.totalCount).toBe(3);
            expect(result.data.map((deck) => deck.name)).toEqual(['Charlie']);

            result = await this.deckService.findByUserName('Stark', {
                filters: [{ id: 'faction.name', value: ['house stark'] }]
            });
            expect(result.data.map((deck) => deck.name).sort()).toEqual(['Alpha', 'Bravo']);

            result = await this.deckService.findByUserName('Stark', {
                filters: [{ id: 'agenda.label', value: 'stag' }]
            });
            expect(result.data.map((deck) => deck.name)).toEqual(['Bravo']);

            result = await this.deckService.findByUserName('Stark', {
                filters: [{ id: 'name', value: '%' }]
            });
            expect(result.totalCount).toBe(0);
        });

        it('should lock a deck used for an event until the event is deleted', async function () {
            const event = await this.eventService.create({ name: 'Tournament' });
            const created = await this.deckService.create(newDeck());

            await this.deckService.useDeckForEvent(created._id, event._id);

            const locked = await this.deckService.getById(created._id);
            expect(locked.locked).toBe(true);
            expect(locked.eventId).toBe(event._id);
            await expectAsync(
                this.deckService.update({ ...newDeck(), id: created._id })
            ).toBeRejectedWithError('Locked decks can not be updated');
            await expectAsync(this.deckService.delete(created._id)).toBeRejectedWithError(
                'Can not delete a locked deck'
            );
            expect((await this.deckService.getDeckForEvent('Stark', event._id))._id).toBe(
                created._id
            );

            await this.eventService.delete(event._id);

            expect((await this.deckService.getById(created._id)).locked).toBe(false);
        });

        it('should only allow one deck per user for an event', async function () {
            const event = await this.eventService.create({ name: 'Tournament' });
            await this.deckService.create(newDeck({ eventId: event._id }));

            await expectAsync(
                this.deckService.create(newDeck({ eventId: event._id }))
            ).toBeRejectedWithError(/already has a deck configured for event/);
        });

        it('should store standalone decks with no owner', async function () {
            await this.deckService.createStandalone(
                newDeck({
                    standaloneDeckId: 'SD-01',
                    lastUpdated: new Date('2026-01-01T00:00:00Z')
                })
            );

            const deck = await this.deckService.getByStandaloneId('SD-01');
            expect(deck.standaloneDeckId).toBe('SD-01');
            expect('username' in deck).toBe(false);

            const result = await this.deckService.getStandaloneDecks({});
            expect(result.data.map((standalone) => standalone.standaloneDeckId)).toEqual(['SD-01']);
        });

        it('should find a deck carried over from MongoDB by its old id', async function () {
            const created = await this.deckService.create(newDeck());
            await db.query('UPDATE decks SET mongo_id = $1 WHERE id = $2', [
                '5f1d7c1e2b3a4c5d6e7f8091',
                created._id
            ]);

            expect((await this.deckService.getById('5f1d7c1e2b3a4c5d6e7f8091'))._id).toBe(
                created._id
            );
            expect(await this.deckService.getById('5f1d7c1e2b3a4c5d6e7f8092')).toBeNull();
        });

        it('should delete a deck and its cards', async function () {
            const created = await this.deckService.create(newDeck());

            await this.deckService.delete(created._id);

            expect(await this.deckService.getById(created._id)).toBeNull();
            expect((await db.query('SELECT count(*) AS count FROM deck_cards'))[0].count).toBe(0);
        });
    });
});
