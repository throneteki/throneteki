import {
    classifyLayout,
    computeAdaptiveScales,
    widestRowUnits
} from '../../client/Components/GameBoard/Adaptive/adaptiveScale.js';

const player = (...cards) => ({ cardPiles: { cardsInPlay: cards } });
const character = (kneeled = false) => ({ type: 'character', kneeled });
const location = (kneeled = false) => ({ type: 'location', kneeled });

describe('classifyLayout', function () {
    it('picks a mode from the board size', function () {
        expect(classifyLayout({ width: 390, height: 780 })).toBe('narrow');
        expect(classifyLayout({ width: 820, height: 1100 })).toBe('narrow');
        expect(classifyLayout({ width: 844, height: 340 })).toBe('short');
        expect(classifyLayout({ width: 1180, height: 760 })).toBe('wide');
        expect(classifyLayout({ width: 1600, height: 900 })).toBe('wide');
    });

    it('treats a portrait board too wide for a phone layout as wide', function () {
        expect(classifyLayout({ width: 1000, height: 1400 })).toBe('wide');
    });

    it('keeps the current mode near a boundary', function () {
        const nearNarrowEdge = { width: 610, height: 670 };
        expect(classifyLayout(nearNarrowEdge)).toBe('wide');
        expect(classifyLayout(nearNarrowEdge, 'narrow')).toBe('narrow');
        expect(classifyLayout(nearNarrowEdge, 'wide')).toBe('wide');

        const nearShortEdge = { width: 900, height: 580 };
        expect(classifyLayout(nearShortEdge, 'short')).toBe('short');
        expect(classifyLayout(nearShortEdge, 'wide')).toBe('wide');
    });

    it('needs a clear margin to enter a new mode once one is set', function () {
        expect(classifyLayout({ width: 900, height: 545 }, 'wide')).toBe('wide');
        expect(classifyLayout({ width: 900, height: 500 }, 'wide')).toBe('short');
    });

    it('leaves a mode once well past its boundary', function () {
        expect(classifyLayout({ width: 1600, height: 900 }, 'narrow')).toBe('wide');
        expect(classifyLayout({ width: 390, height: 780 }, 'short')).toBe('narrow');
    });

    it('keeps the current mode, or wide, when the board has no size yet', function () {
        expect(classifyLayout({ width: 0, height: 0 }, 'short')).toBe('short');
        expect(classifyLayout(undefined)).toBe('wide');
    });
});

describe('widestRowUnits', function () {
    it('measures the widest row across every player', function () {
        expect(
            widestRowUnits([
                player(character(), character(), location()),
                player(location(), location(), location())
            ])
        ).toBe(3);
    });

    it('counts attachments in the character row and kneeling cards as wider', function () {
        expect(widestRowUnits([player(character(true), { type: 'attachment' })])).toBeCloseTo(2.4);
    });

    it('is zero for an empty board', function () {
        expect(widestRowUnits([player(), {}])).toBe(0);
        expect(widestRowUnits(undefined)).toBe(0);
    });
});

describe('computeAdaptiveScales', function () {
    it('uses the comfortable size when there is room', function () {
        expect(computeAdaptiveScales({ mode: 'wide', width: 1600, height: 950 })).toEqual({
            card: 1,
            pile: 1,
            hand: 1
        });
    });

    it('draws piles smaller and the hand larger on a phone', function () {
        const scales = computeAdaptiveScales({ mode: 'narrow', width: 390, height: 780 });
        expect(scales.pile).toBeLessThan(scales.card);
        expect(scales.hand).toBeGreaterThan(scales.card);
    });

    it('always fits the play areas in the height', function () {
        const height = 340;
        const { card } = computeAdaptiveScales({
            mode: 'short',
            width: 844,
            height,
            cardsSize: 3
        });
        const rem = 16;
        expect(4 * 5.6 * rem * card + 0.4 * 5.6 * rem * card * 1.1).toBeLessThanOrEqual(height);
    });

    it('shrinks for a wide row only down to the mode minimum', function () {
        const roomy = computeAdaptiveScales({
            mode: 'narrow',
            width: 390,
            height: 780,
            widestRow: 3
        });
        const crowded = computeAdaptiveScales({
            mode: 'narrow',
            width: 390,
            height: 780,
            widestRow: 7
        });
        const packed = computeAdaptiveScales({
            mode: 'narrow',
            width: 390,
            height: 780,
            widestRow: 20
        });
        expect(crowded.card).toBeLessThan(roomy.card);
        expect(packed.card).toBe(0.55);
    });

    it('scales with the chosen card size within the room available', function () {
        const normal = computeAdaptiveScales({ mode: 'wide', width: 2400, height: 1400 });
        const large = computeAdaptiveScales({
            mode: 'wide',
            width: 2400,
            height: 1400,
            cardsSize: 1.4
        });
        expect(large.card).toBeGreaterThan(normal.card);
    });

    it('steps in twentieths so small resizes do not change it', function () {
        const { card, pile, hand } = computeAdaptiveScales({
            mode: 'narrow',
            width: 377,
            height: 733
        });
        for (const value of [card, pile, hand]) {
            expect(Math.round(value * 20)).toBeCloseTo(value * 20);
        }
    });
});
