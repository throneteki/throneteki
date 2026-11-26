import { cardBoxClass, settleAutoCardScale } from '../../client/cardScale.js';

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
