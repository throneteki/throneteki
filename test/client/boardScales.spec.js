import { adaptiveScales, fitSizedHud } from '../../client/Components/GameBoard/boardScales.js';
import { cardRoom } from '../../client/Components/GameBoard/Adaptive/adaptiveScale.js';

const phone = {
    container: { width: 390, height: 844 },
    viewport: { width: 390, height: 844 },
    mode: 'narrow'
};
const desktop = {
    container: { width: 1600, height: 902 },
    viewport: { width: 1600, height: 950 },
    mode: 'wide'
};
const hud = (changes) => ({
    auto: true,
    cards: 'normal',
    interface: 'normal',
    ...changes
});

describe('cardRoom', function () {
    it('leaves the cards less room as the interface grows', function () {
        const size = { mode: 'narrow', width: 390, height: 844 };
        expect(cardRoom({ ...size, interfaceScale: 1.4 })).toBeLessThan(
            cardRoom({ ...size, interfaceScale: 1 })
        );
    });
});

describe('adaptiveScales', function () {
    it('fits the cards the same whatever the interface size', function () {
        for (const measure of [phone, desktop]) {
            const normal = adaptiveScales(hud(), measure);
            const larger = adaptiveScales(hud({ interface: '1.6' }), measure);
            expect(larger.cards).toBe(normal.cards);
            expect(larger.interface).toBeGreaterThan(normal.interface);
        }
    });

    it('says the cards fit at the normal sizes', function () {
        expect(adaptiveScales(hud(), phone).fits).toBe(true);
        expect(adaptiveScales(hud(), desktop).fits).toBe(true);
    });

    it('says the cards do not fit once the interface takes their room', function () {
        expect(adaptiveScales(hud({ interface: '2' }), phone).fits).toBe(false);
    });

    it('blames nothing when the cards fit', function () {
        expect(adaptiveScales(hud(), phone).overflow).toBe(null);
    });

    it('blames the interface when it is what takes the cards their room', function () {
        expect(adaptiveScales(hud({ interface: '2' }), phone).overflow).toBe('interface');
    });

    it('blames the cards when they would not fit beside a normal interface', function () {
        expect(adaptiveScales(hud({ cards: '2' }), desktop).overflow).toBe('cards');
        expect(adaptiveScales(hud({ cards: '2', interface: '2' }), desktop).overflow).toBe('cards');
    });

    it('says the cards do not fit when drawn larger than the room', function () {
        expect(adaptiveScales(hud({ cards: '2' }), desktop).fits).toBe(false);
        expect(adaptiveScales(hud({ auto: false, cards: '3' }), phone).fits).toBe(false);
    });
});

describe('fitSizedHud', function () {
    it('leaves fitted sizes as they are', function () {
        const fitted = hud({ cards: '1.2' });
        expect(fitSizedHud(fitted, desktop)).toBe(fitted);
    });

    it('turns a fixed size into the fitted sizes that draw the same', function () {
        const fixed = hud({ auto: false, cards: '1.4', interface: '1.2' });
        const converted = fitSizedHud(fixed, desktop);
        expect(converted.auto).toBe(true);
        const before = adaptiveScales(fixed, desktop);
        const after = adaptiveScales(converted, desktop);
        expect(after.cards).toBeCloseTo(before.cards, 1);
        expect(after.interface).toBeCloseTo(before.interface, 1);
    });
});
