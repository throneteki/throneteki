import { deckFrames, shuffleConfig, turnFrames } from '../../client/shuffle.js';

const ordered = (frames) => {
    const offsets = frames.map((frame) => frame.offset);
    return offsets.every((offset, index) => index === 0 || offset >= offsets[index - 1]);
};

describe('deckFrames', function () {
    it('grows the deck towards the viewer and settles back to its size', function () {
        const frames = deckFrames();

        expect(frames[0].transform).toContain('scale(1)');
        expect(frames[1].transform).toContain(`scale(${shuffleConfig.grow})`);
        expect(frames.at(-1).transform).toContain('scale(1)');
        expect(ordered(frames)).toBe(true);
    });

    it('shakes from side to side', function () {
        const shakes = deckFrames().map(
            (frame) => frame.transform.match(/translateX\((-?[\d.]+)px/)[1]
        );

        expect(shakes).toContain('-3');
        expect(shakes).toContain('3');
    });
});

describe('turnFrames', function () {
    it('turns the card half a circle where it lies, without turning it over', function () {
        const frames = turnFrames(0);

        expect(frames[0].transform).toBe('rotate(0deg)');
        expect(frames.at(-1).transform).toBe('rotate(180deg)');
        expect(frames.every((frame) => !/rotate[XY]/.test(frame.transform))).toBe(true);
        expect(ordered(frames)).toBe(true);
    });

    it('turns the next card the other way', function () {
        expect(turnFrames(1).at(-1).transform).toBe('rotate(-180deg)');
    });

    it('starts a later card later, and finishes within the shuffle', function () {
        const first = turnFrames(0).find((frame) => frame.transform.includes('180deg')).offset;
        const second = turnFrames(1).find((frame) => frame.transform.includes('180deg')).offset;

        expect(second).toBeGreaterThan(first);
        expect(
            Math.max(...turnFrames(shuffleConfig.cards - 1).map((frame) => frame.offset))
        ).toBeLessThanOrEqual(1);
    });
});
