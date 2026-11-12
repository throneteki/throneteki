import { resetDatabase } from '../helpers/database.js';
import CardService from '../../../../server/services/CardService.js';
import DeckService from '../../../../server/services/DeckService.js';
import EventService from '../../../../server/services/EventService.js';
import UserService from '../../../../server/services/UserService.js';

const cards = [
    { code: '01001', name: 'A Clash of Kings', label: 'A Clash of Kings', type: 'plot' },
    { code: '01027', name: 'Fealty', label: 'Fealty', type: 'agenda' },
    { code: '01028', name: 'Littlefinger', label: 'Littlefinger', type: 'character' }
];

const Uuid = 'a6e3b2a0-0000-4000-8000-000000000001';

function importedDeck(overrides = {}) {
    return {
        name: 'Winter is Coming',
        faction: 'stark',
        agenda: '01027',
        bannerCards: [],
        plotCards: [{ cardcode: '01001', count: 1 }],
        drawCards: [{ cardcode: '01028', count: 3 }],
        format: 'joust',
        variant: 'standard',
        thronesDbUuid: Uuid,
        lastUpdated: new Date('2026-11-01T10:00:00Z'),
        ...overrides
    };
}

describe('DeckService ThronesDB decks', function () {
    beforeEach(async function () {
        await resetDatabase();

        this.userService = new UserService({ getValue: () => 'test-secret' });
        this.cardService = new CardService();
        this.eventService = new EventService();
        this.deckService = new DeckService(this.cardService, this.eventService);

        await this.cardService.replaceCards(cards);
        await this.deckService.init();

        for (const [username, email] of [
            ['Stark', 'ned@winterfell.example'],
            ['Lannister', 'tywin@casterly.example']
        ]) {
            await this.userService.addUser({ username, email, password: 'hash', verified: true });
        }
    });

    it('creates a deck linked to its ThronesDB uuid', async function () {
        expect(await this.deckService.importThronesDbDeck('Stark', importedDeck())).toBe('created');

        const { data } = await this.deckService.findByUserName('Stark');
        expect(data).toHaveLength(1);
        expect(data[0]).toEqual(
            expect.objectContaining({
                name: 'Winter is Coming',
                agenda: '01027',
                thronesDbUuid: Uuid,
                lastUpdated: new Date('2026-11-01T10:00:00Z'),
                drawCards: [{ cardcode: '01028', count: 3 }]
            })
        );
        expect(await this.deckService.getThronesDbUuids('Stark')).toEqual(new Set([Uuid]));
    });

    it('does not overwrite a deck that was already imported', async function () {
        await this.deckService.importThronesDbDeck('Stark', importedDeck());

        expect(
            await this.deckService.importThronesDbDeck('Stark', importedDeck({ name: 'Renamed' }))
        ).toBe('skipped');
        expect((await this.deckService.findByUserName('Stark')).data[0].name).toBe(
            'Winter is Coming'
        );
    });

    it('imports a deck once when two imports run at the same time', async function () {
        const results = await Promise.all([
            this.deckService.importThronesDbDeck('Stark', importedDeck()),
            this.deckService.importThronesDbDeck('Stark', importedDeck())
        ]);

        expect(results.sort()).toEqual(['created', 'skipped']);
        expect((await this.deckService.findByUserName('Stark')).data).toHaveLength(1);
    });

    it('syncs the cards of an imported deck but keeps its format and favourite', async function () {
        await this.deckService.importThronesDbDeck('Stark', importedDeck());
        const [deck] = (await this.deckService.findByUserName('Stark')).data;
        await this.deckService.update({
            ...deck,
            id: deck._id,
            format: 'melee',
            isFavourite: true,
            drawCards: [{ cardcode: '01028', count: 1 }]
        });

        expect(
            await this.deckService.syncThronesDbDeck(
                'Stark',
                importedDeck({ name: 'Renamed', plotCards: [], drawCards: [] })
            )
        ).toBe('updated');

        const { data } = await this.deckService.findByUserName('Stark');
        expect(data).toHaveLength(1);
        expect(data[0]).toEqual(
            expect.objectContaining({
                name: 'Renamed',
                format: 'melee',
                isFavourite: true,
                plotCards: [],
                drawCards: [],
                thronesDbUuid: Uuid
            })
        );
    });

    it('does not create decks when syncing', async function () {
        expect(await this.deckService.syncThronesDbDeck('Stark', importedDeck())).toBe('skipped');
        expect((await this.deckService.findByUserName('Stark')).data).toHaveLength(0);
    });

    it('keeps the same ThronesDB deck separate for different users', async function () {
        await this.deckService.importThronesDbDeck('Stark', importedDeck());

        expect(await this.deckService.importThronesDbDeck('Lannister', importedDeck())).toBe(
            'created'
        );
        expect((await this.deckService.findByUserName('Stark')).data).toHaveLength(1);
    });

    it('does not change an imported deck registered for an event', async function () {
        await this.deckService.importThronesDbDeck('Stark', importedDeck());
        const event = await this.eventService.create({ name: 'Regional' });
        const [deck] = (await this.deckService.findByUserName('Stark')).data;
        await this.deckService.useDeckForEvent(deck._id, event._id);

        expect(
            await this.deckService.syncThronesDbDeck('Stark', importedDeck({ name: 'Renamed' }))
        ).toBe('locked');
        expect((await this.deckService.findByUserName('Stark')).data[0].name).toBe(
            'Winter is Coming'
        );
    });

    it('ignores a ThronesDB uuid sent with a deck created from the client', async function () {
        await this.deckService.create({ ...importedDeck(), username: 'Stark' });

        const { data } = await this.deckService.findByUserName('Stark');
        expect(data[0].thronesDbUuid).toBeUndefined();
        expect(await this.deckService.importThronesDbDeck('Stark', importedDeck())).toBe('created');
    });
});
