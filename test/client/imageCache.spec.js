import {
    collectPlayerCodes,
    collectShownCodes
} from '../../client/Components/GameBoard/useImagePreload.js';

describe('collectPlayerCodes', function () {
    it('collects visible card codes from piles, single cards and nested cards', function () {
        const players = {
            alice: {
                cardPiles: {
                    hand: [
                        { uuid: '1', code: '01001' },
                        { uuid: '2', facedown: true }
                    ],
                    cardsInPlay: [
                        {
                            uuid: '3',
                            code: '01002',
                            attachments: [{ uuid: '4', code: '01003' }],
                            dupes: [{ uuid: '5', code: '01002' }],
                            childCards: [{ uuid: '6', code: '01004' }]
                        }
                    ]
                },
                activePlot: { uuid: '7', code: '01005' },
                faction: { uuid: '8', code: '01198' },
                agendas: [{ uuid: '9', code: '01006' }],
                title: null
            },
            bob: { cardPiles: { hand: [{ uuid: '10', facedown: true, code: '' }] } }
        };

        expect([...collectPlayerCodes(players)].sort()).toEqual([
            '01001',
            '01002',
            '01003',
            '01004',
            '01005',
            '01006',
            '01198'
        ]);
    });

    it('returns nothing when there are no players', function () {
        expect(collectPlayerCodes(undefined).size).toBe(0);
    });
});

describe('preloadImage', function () {
    let imageCache;
    let created;

    beforeEach(async function () {
        vi.resetModules();
        created = [];
        globalThis.Image = class {
            constructor() {
                this.resolveDecode = null;
                created.push(this);
            }
            decode() {
                return new Promise((resolve, reject) => {
                    this.resolveDecode = resolve;
                    this.rejectDecode = reject;
                });
            }
        };
        imageCache = await import('../../client/imageCache.js');
    });

    afterEach(function () {
        delete globalThis.Image;
    });

    it('loads each image once and records it as loaded', async function () {
        const first = imageCache.preloadImage('/img/cards/a.png');
        const second = imageCache.preloadImage('/img/cards/a.png');

        expect(created).toHaveLength(1);
        created[0].resolveDecode();
        await Promise.all([first, second]);

        expect(imageCache.getImageStatus('/img/cards/a.png')).toBe('loaded');
        await imageCache.preloadImage('/img/cards/a.png');
        expect(created).toHaveLength(1);
    });

    it('runs at most four loads at a time', async function () {
        const sources = [1, 2, 3, 4, 5, 6].map((n) => `/img/cards/${n}.png`);
        const promises = sources.map((src) => imageCache.preloadImage(src));

        expect(created).toHaveLength(4);
        created[0].resolveDecode();
        await promises[0];
        await Promise.resolve();

        expect(created).toHaveLength(5);
    });

    it('records a failed load as an error without retrying', async function () {
        const promise = imageCache.preloadImage('/img/cards/missing.png');
        created[0].rejectDecode(new Error('404'));
        await promise;

        expect(imageCache.getImageStatus('/img/cards/missing.png')).toBe('error');
        await imageCache.preloadImage('/img/cards/missing.png');
        expect(created).toHaveLength(1);
    });
});

describe('preloading in the background', function () {
    let imageCache;
    let created;

    beforeEach(async function () {
        vi.resetModules();
        created = [];
        globalThis.Image = class {
            constructor() {
                created.push(this);
            }
            decode() {
                return new Promise((resolve) => {
                    this.resolveDecode = resolve;
                });
            }
        };
        imageCache = await import('../../client/imageCache.js');
    });

    afterEach(function () {
        delete globalThis.Image;
    });

    it('loads images that are shown before images nothing is waiting for yet', async function () {
        [1, 2, 3, 4].forEach((n) => imageCache.preloadImage(`/img/cards/${n}.png`));
        imageCache.preloadImage('/img/cards/background.png', imageCache.background);
        imageCache.preloadImage('/img/cards/shown.png');

        created[0].resolveDecode();
        await Promise.resolve();
        await Promise.resolve();

        expect(created[4].src).toBe('/img/cards/shown.png');
    });

    it('only runs two background loads at a time, and asks for them to be low priority', function () {
        [1, 2, 3, 4].forEach((n) =>
            imageCache.preloadImage(`/img/cards/${n}.png`, imageCache.background)
        );

        expect(created).toHaveLength(2);
        expect(created.every((image) => image.fetchPriority === 'low')).toBe(true);
    });

    it('asks for shown images with high priority', function () {
        imageCache.preloadImage('/img/cards/a.png');

        expect(created[0].fetchPriority).toBe('high');
    });
});

describe('collectShownCodes', function () {
    it('collects what is on the table and the top of each pile, but not deeper cards', function () {
        const card = (code) => ({ uuid: code, code });
        const players = {
            alice: {
                cardPiles: {
                    hand: [card('01001')],
                    cardsInPlay: [card('01002')],
                    discardPile: [card('01003'), card('01004'), card('01005')],
                    drawDeck: [card('01006')]
                },
                activePlot: card('01007')
            }
        };

        expect([...collectShownCodes(players)].sort()).toEqual([
            '01001',
            '01002',
            '01003',
            '01004',
            '01007'
        ]);
    });
});
