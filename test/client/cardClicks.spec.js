import {
    clickActsAtOnce,
    clickDoesSomething
} from '../../client/Components/GameBoard/cardClicks.js';

describe('clickDoesSomething', function () {
    it('is true for a card the server says can be chosen, is chosen, or can be used', function () {
        expect(clickDoesSomething({ selectable: true })).toBe(true);
        expect(clickDoesSomething({ selected: true })).toBe(true);
        expect(clickDoesSomething({ canPlay: true })).toBe(true);
    });

    it('is false for a card the server would ignore, such as on an opponent card', function () {
        expect(clickDoesSomething({ unselectable: true })).toBe(false);
        expect(clickDoesSomething({ canPlay: false })).toBe(false);
        expect(clickDoesSomething({})).toBe(false);
    });

    it('is true for any card in manual mode, where a click can kneel or stand it', function () {
        expect(clickDoesSomething({}, true)).toBe(true);
    });
});

describe('clickActsAtOnce', function () {
    it('is true for a card that can be used, or chosen in a prompt that ends on the first card', function () {
        expect(clickActsAtOnce({ canPlay: true }, false)).toBe(true);
        expect(clickActsAtOnce({ selectable: true }, true)).toBe(true);
    });

    it('is false for a card chosen in a prompt confirmed with Done', function () {
        expect(clickActsAtOnce({ selectable: true }, false)).toBe(false);
        expect(clickActsAtOnce({ selected: true }, false)).toBe(false);
    });

    it('is false for a card the server would ignore', function () {
        expect(clickActsAtOnce({ unselectable: true }, true)).toBe(false);
        expect(clickActsAtOnce({}, true)).toBe(false);
    });
});
