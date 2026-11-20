import {
    adaptiveInterfaceScale,
    classifyLayout,
    computeAdaptiveScales,
    effectiveCardsSize,
    stripExtraUnits,
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

describe('stripExtraUnits', function () {
    it('adds the piles a strip shows only while they hold cards, for the widest strip', function () {
        const plain = { cardPiles: { shadows: [], outOfGamePile: [] }, agendas: [{}] };
        const busy = {
            cardPiles: { shadows: [{}], outOfGamePile: [{}] },
            agendas: [{}, {}],
            title: {}
        };
        expect(stripExtraUnits([plain])).toBe(0);
        expect(stripExtraUnits([plain, busy])).toBeCloseTo(1.5 + 1.4 + 1 + 0.35);
        expect(stripExtraUnits(undefined)).toBe(0);
    });
});

describe('computeAdaptiveScales', function () {
    it('grows the cards to fill the room available', function () {
        const desktop = computeAdaptiveScales({ mode: 'wide', width: 1600, height: 950 });
        const bigDesktop = computeAdaptiveScales({ mode: 'wide', width: 2560, height: 1440 });
        expect(desktop.card).toBeGreaterThan(1);
        expect(bigDesktop.card).toBeGreaterThan(desktop.card);
        expect(bigDesktop.card).toBeLessThanOrEqual(2);
    });

    it('never draws piles larger than cards in play, and draws the hand larger', function () {
        for (const [width, height] of [
            [360, 740],
            [390, 780],
            [430, 932],
            [820, 1180]
        ]) {
            const scales = computeAdaptiveScales({ mode: 'narrow', width, height });
            expect(scales.pile).toBeLessThanOrEqual(scales.card);
            expect(scales.hand).toBeGreaterThan(scales.card);
        }
    });

    it('always fits the play areas in the height at the normal card size', function () {
        const height = 340;
        const { card } = computeAdaptiveScales({
            mode: 'short',
            width: 844,
            height
        });
        const rem = 16;
        expect(4 * 5.6 * rem * card + 0.4 * 5.6 * rem * card * 1.1).toBeLessThanOrEqual(height);
    });

    it('shrinks for a wide row only down to the mode minimum', function () {
        const roomy = computeAdaptiveScales({
            mode: 'narrow',
            width: 430,
            height: 1100,
            widestRow: 3
        });
        const crowded = computeAdaptiveScales({
            mode: 'narrow',
            width: 430,
            height: 1100,
            widestRow: 7
        });
        const packed = computeAdaptiveScales({
            mode: 'narrow',
            width: 430,
            height: 1100,
            widestRow: 20
        });
        expect(crowded.card).toBeLessThan(roomy.card);
        expect(packed.card).toBe(0.85);
    });

    it("keeps a phone's piles readable, letting the opponent's wider strip squeeze or scroll", function () {
        const phone = computeAdaptiveScales({ mode: 'narrow', width: 390, height: 844 });
        const oneLine = 7.5 * 4 * 16 * phone.pile + 7.5 * 6;
        expect(phone.pile).toBeGreaterThanOrEqual(0.7);
        expect(oneLine).toBeGreaterThan(390);
        expect(phone.card).toBeGreaterThanOrEqual(phone.pile);
    });

    it('keeps a phone strip on one line when its piles fit at a readable size', function () {
        const tablet = computeAdaptiveScales({ mode: 'narrow', width: 820, height: 1180 });
        const oneLine = 7.5 * 4 * 16 * tablet.pile + 7.5 * 6;
        expect(oneLine).toBeLessThanOrEqual(820 - 16);
        expect(tablet.pile).toBeGreaterThanOrEqual(0.75);
    });

    it('makes room in the strip for piles that hold cards', function () {
        const size = { mode: 'narrow', width: 375, height: 1000 };
        expect(computeAdaptiveScales({ ...size, stripExtra: 3 }).pile).toBeLessThan(
            computeAdaptiveScales(size).pile
        );
    });

    it('keeps piles at the card size on a wide board, whose strips scroll rather than shrink the cards', function () {
        const roomy = computeAdaptiveScales({ mode: 'wide', width: 1600, height: 950 });
        const narrower = computeAdaptiveScales({ mode: 'wide', width: 1000, height: 950 });
        expect(roomy.pile).toBe(roomy.card);
        expect(narrower.pile).toBe(narrower.card);
        expect(narrower.card).toBe(roomy.card);
    });

    it('draws smaller cards for a small card size and larger ones for a large one', function () {
        const size = { mode: 'wide', width: 1600, height: 950 };
        const normal = computeAdaptiveScales(size);
        const small = computeAdaptiveScales({ ...size, cardsSize: 0.7 });
        const large = computeAdaptiveScales({ ...size, cardsSize: 1.4 });
        expect(small.card).toBeLessThan(normal.card);
        expect(large.card).toBeGreaterThan(normal.card);
    });

    it('draws cards at the chosen size, unfitted, without auto scaling', function () {
        for (const mode of ['narrow', 'short', 'wide']) {
            const size = { mode, width: 390, height: 844 };
            expect(computeAdaptiveScales({ ...size, cardsSize: 1.4, auto: false }).card).toBe(1.4);
            expect(computeAdaptiveScales({ ...size, cardsSize: 0.7, auto: false }).card).toBe(0.7);
        }
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

describe('effectiveCardsSize', function () {
    it('keeps a larger card size whole on a desktop-sized board', function () {
        expect(effectiveCardsSize(1.4, { width: 1600, height: 950 })).toBeCloseTo(1.4);
    });

    it('adds a quarter of a larger card size on a phone, upright or turned', function () {
        expect(effectiveCardsSize(1.4, { width: 390, height: 844 })).toBeCloseTo(1.1);
        expect(effectiveCardsSize(1.4, { width: 844, height: 390 })).toBeCloseTo(1.1);
    });

    it('adds part of a larger card size on a tablet', function () {
        const tablet = effectiveCardsSize(1.4, { width: 768, height: 1024 });
        expect(tablet).toBeGreaterThan(1.1);
        expect(tablet).toBeLessThan(1.4);
    });

    it('leaves normal and smaller card sizes alone', function () {
        expect(effectiveCardsSize(1, { width: 390, height: 844 })).toBe(1);
        expect(effectiveCardsSize(0.7, { width: 390, height: 844 })).toBe(0.7);
    });

    it('draws large cards on a phone only a little larger than normal ones', function () {
        const size = { mode: 'narrow', width: 390, height: 844 };
        const normal = computeAdaptiveScales(size).card;
        const large = computeAdaptiveScales({ ...size, cardsSize: 1.4 }).card;
        expect(large).toBeGreaterThan(normal);
        expect(large).toBeLessThanOrEqual(Math.round(normal * 1.1 * 20) / 20 + 0.05);
    });
});

describe('phone landscape card sizes', function () {
    it('draws the hands and piles as large as the cards in play', function () {
        for (const [width, height] of [
            [844, 390],
            [915, 412]
        ]) {
            const { card, pile, hand } = computeAdaptiveScales({ mode: 'short', width, height });
            expect(pile).toBe(card);
            expect(hand).toBe(card);
        }
    });

    it('fills the height with two strips and two play lines, leaving little spare', function () {
        const rem = 16;
        const height = 390;
        const { card } = computeAdaptiveScales({ mode: 'short', width: 844, height });
        const cardHeight = 5.6 * rem * card;
        // Four lines of cards, the strips' padding (1.5rem; the prompt is in a column at the side) and each play
        // area's margins (1rem)
        const used = 4 * cardHeight + 1.5 * rem + 2 * rem;
        expect(used).toBeLessThanOrEqual(height);
        expect(height - used).toBeLessThan(cardHeight * 0.75);
    });
});

describe('adaptiveInterfaceScale', function () {
    it('is normal on a usual phone, and a step smaller on a usual desktop', function () {
        expect(adaptiveInterfaceScale('narrow', { width: 390, height: 844 })).toBe(1);
        expect(adaptiveInterfaceScale('short', { width: 844, height: 390 })).toBe(1);
        expect(adaptiveInterfaceScale('wide', { width: 1600, height: 950 })).toBe(0.9);
    });

    it('grows on larger screens and shrinks on smaller ones, within its range', function () {
        expect(adaptiveInterfaceScale('narrow', { width: 820, height: 1180 })).toBeGreaterThan(1);
        const desktop = adaptiveInterfaceScale('wide', { width: 1600, height: 950 });
        expect(adaptiveInterfaceScale('wide', { width: 1920, height: 1080 })).toBeGreaterThan(
            desktop
        );
        expect(adaptiveInterfaceScale('wide', { width: 1280, height: 720 })).toBeLessThan(desktop);
        expect(adaptiveInterfaceScale('narrow', { width: 320, height: 568 })).toBe(0.85);
        expect(adaptiveInterfaceScale('wide', { width: 3840, height: 2160 })).toBe(1.15);
    });

    it('leaves the cards less room as the interface grows', function () {
        const size = { mode: 'narrow', width: 390, height: 844 };
        const normal = computeAdaptiveScales(size).card;
        const larger = computeAdaptiveScales({ ...size, interfaceScale: 1.4 }).card;
        expect(larger).toBeLessThan(normal);
    });
});
