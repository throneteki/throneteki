import EventEmitter from 'events';
import Lobby from '../../server/lobby.js';

describe('lobby card data for game nodes', function () {
    beforeEach(async function () {
        this.router = { on: vi.fn(), sendCommand: vi.fn() };
        this.deckService = Object.assign(new EventEmitter(), {
            init: vi.fn(),
            cards: { '01001': { code: '01001', type: 'plot' } },
            packs: [{ code: 'Core' }]
        });
        this.cardService = {
            getAllCards: vi.fn().mockResolvedValue({ '01001': { code: '01001', type: 'plot' } }),
            getTitleCards: vi.fn().mockResolvedValue({}),
            getAllPacks: vi.fn().mockResolvedValue([{ code: 'Core' }]),
            getRestrictedList: vi.fn().mockResolvedValue([{ name: 'RL' }])
        };

        this.lobby = new Lobby(
            {},
            {
                io: { use: vi.fn(), on: vi.fn() },
                messageService: { on: vi.fn() },
                cardService: this.cardService,
                deckService: this.deckService,
                eventService: { init: vi.fn() },
                userService: { on: vi.fn() },
                router: this.router,
                config: {}
            }
        );
        await this.lobby.init();
    });

    function cardDataSent(router, channel) {
        return router.sendCommand.mock.calls
            .filter(([sentTo, command]) => sentTo === channel && command === 'CARDDATA')
            .map(([, , data]) => data);
    }

    it('sends card data to a node when it starts', async function () {
        this.lobby.onWorkerStarted('node1');
        await vi.waitFor(() => expect(cardDataSent(this.router, 'node1')).toHaveLength(1));

        expect(cardDataSent(this.router, 'node1')[0].restrictedListData).toEqual([{ name: 'RL' }]);
    });

    describe('when the deck service reloads card data', function () {
        beforeEach(async function () {
            this.lobby.onWorkerStarted('node1');
            await vi.waitFor(() => expect(cardDataSent(this.router, 'node1')).toHaveLength(1));

            this.deckService.cards = {
                '01001': { code: '01001', type: 'plot' },
                27040: { code: '27040', type: 'agenda' },
                '01206': { code: '01206', type: 'title' }
            };
            this.deckService.packs = [{ code: 'Core' }, { code: 'WGYK' }];
            this.deckService.emit('cardDataReloaded');
        });

        it('sends the new card data to every node at once', function () {
            const [data] = cardDataSent(this.router, 'allnodes');

            expect(data.cardData).toBe(this.deckService.cards);
            expect(data.packData).toEqual([{ code: 'Core' }, { code: 'WGYK' }]);
            expect(Object.keys(data.titleCardData)).toEqual(['01206']);
            expect(data.restrictedListData).toEqual([{ name: 'RL' }]);
        });
    });
});
