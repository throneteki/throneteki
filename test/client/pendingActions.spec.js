import {
    clickActsAtOnce,
    clickDoesSomething,
    pendingKeys,
    pendingStore
} from '../../client/Components/GameBoard/pendingActions.js';

describe('pendingStore', function () {
    afterEach(function () {
        pendingStore.clear();
    });

    it('holds what an action acted on until it is answered', function () {
        const key = pendingKeys.card('a');
        const done = pendingStore.add([key]);
        expect(pendingStore.has(key)).toBe(true);
        done();
        expect(pendingStore.has(key)).toBe(false);
    });

    it('keeps an action sent again pending when the first send is answered', function () {
        const key = pendingKeys.card('a');
        const first = pendingStore.add([key]);
        const second = pendingStore.add([key]);
        first();
        expect(pendingStore.has(key)).toBe(true);
        second();
        expect(pendingStore.has(key)).toBe(false);
    });

    it('says when the longest wait began, and nothing when none is waiting', function () {
        expect(pendingStore.oldest()).toBe(null);
        const first = pendingStore.add([pendingKeys.prompt('p1')]);
        const startedAt = pendingStore.oldest();
        pendingStore.add([pendingKeys.card('b')]);
        expect(pendingStore.oldest()).toBe(startedAt);
        first();
        expect(pendingStore.oldest()).toBeGreaterThanOrEqual(startedAt);
    });

    it('keys a prompt button by its prompt, method and argument', function () {
        expect(pendingKeys.button({ promptId: 'p1', method: 'menuButton', arg: 'done' })).toBe(
            'button:p1:menuButton:done'
        );
    });
});

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
