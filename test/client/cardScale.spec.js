import { cardBoxClass, computeAutoCardScale, settleAutoCardScale } from '../../client/cardScale.js';

describe('computeAutoCardScale', function () {
    it('is limited by the smaller of the width and height fits', function () {
        const wide = computeAutoCardScale({ width: 4000, height: 900 });
        const tall = computeAutoCardScale({ width: 900, height: 4000 });

        expect(wide).toBeCloseTo(0.9, 5);
        expect(tall).toBeCloseTo(0.9, 5);
    });

    it('shrinks on small screens but never below the minimum', function () {
        expect(computeAutoCardScale({ width: 600, height: 700 })).toBe(0.6);
        expect(computeAutoCardScale({ width: 300, height: 300 })).toBe(0.5);
    });

    it('grows on large screens but never above the maximum', function () {
        expect(computeAutoCardScale({ width: 1792, height: 1792 })).toBe(1.5);
        expect(computeAutoCardScale({ width: 9000, height: 9000 })).toBe(1.5);
    });

    it('rounds down to a 0.05 step', function () {
        expect(computeAutoCardScale({ width: 1200, height: 1200 })).toBe(1.2);
    });
});

describe('settleAutoCardScale', function () {
    it('takes the first value and any shrink immediately', function () {
        expect(settleAutoCardScale(null, 1)).toBe(1);
        expect(settleAutoCardScale(1, 0.9)).toBe(0.9);
    });

    it('ignores a single-step growth and accepts two or more steps', function () {
        expect(settleAutoCardScale(1, 1.05)).toBe(1);
        expect(settleAutoCardScale(1, 1.1)).toBe(1.1);
    });
});

describe('cardBoxClass', function () {
    it('returns the classes for each orientation', function () {
        expect(cardBoxClass()).toBe('card-box');
        expect(cardBoxClass('horizontal')).toBe('card-box-horizontal');
        expect(cardBoxClass('kneeled')).toBe('card-box-horizontal card-box-kneeled');
        expect(cardBoxClass('rotated')).toBe('card-box card-box-rotated');
    });
});
