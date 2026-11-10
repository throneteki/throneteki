import { reuseUnchanged } from '../../client/redux/reuseUnchanged.js';

describe('reuseUnchanged', function () {
    const makeGame = () => ({
        round: 1,
        players: {
            alice: {
                hand: [
                    { uuid: 'a', name: 'A', kneeled: false },
                    { uuid: 'b', name: 'B', kneeled: false },
                    { uuid: 'c', name: 'C', kneeled: false }
                ],
                stats: { gold: 3 }
            },
            bob: { hand: [{ uuid: 'd', name: 'D' }], stats: { gold: 5 } }
        },
        messages: ['one', 'two']
    });

    it('returns the previous object when nothing changed', function () {
        const previous = makeGame();
        expect(reuseUnchanged(previous, makeGame())).toBe(previous);
    });

    it('keeps unchanged branches and replaces only the changed path', function () {
        const previous = makeGame();
        const next = makeGame();
        next.players.alice.hand[1].kneeled = true;

        const result = reuseUnchanged(previous, next);

        expect(result).not.toBe(previous);
        expect(result.players.bob).toBe(previous.players.bob);
        expect(result.players.alice.stats).toBe(previous.players.alice.stats);
        expect(result.players.alice.hand[0]).toBe(previous.players.alice.hand[0]);
        expect(result.players.alice.hand[1]).not.toBe(previous.players.alice.hand[1]);
        expect(result.players.alice.hand[2]).toBe(previous.players.alice.hand[2]);
    });

    it('matches cards by uuid when a card leaves the middle of a list', function () {
        const previous = makeGame();
        const next = makeGame();
        next.players.alice.hand.splice(0, 1);

        const result = reuseUnchanged(previous, next);

        expect(result.players.alice.hand).toHaveLength(2);
        expect(result.players.alice.hand[0]).toBe(previous.players.alice.hand[1]);
        expect(result.players.alice.hand[1]).toBe(previous.players.alice.hand[2]);
    });

    it('returns the previous array when only the contents are identical', function () {
        const previous = makeGame();
        const next = makeGame();
        next.round = 2;

        const result = reuseUnchanged(previous, next);

        expect(result.round).toBe(2);
        expect(result.messages).toBe(previous.messages);
    });

    it('uses the new value when the types differ or there is no previous value', function () {
        const next = makeGame();
        expect(reuseUnchanged(undefined, next)).toBe(next);
        expect(reuseUnchanged({ a: 1 }, [1])).toEqual([1]);
    });
});
