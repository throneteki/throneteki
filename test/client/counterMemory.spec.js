import {
    firstSight,
    forgetBoard,
    hold,
    release,
    remember,
    showBoard
} from '../../client/counterMemory.js';

describe('counterMemory', function () {
    beforeEach(function () {
        forgetBoard();
    });

    it('treats counters drawn while the board first fills in as already there', function () {
        expect(firstSight('card-1:gold--0', 3, true)).toEqual({ previous: 3, shown: 3 });
    });

    it('counts tokens placed several at once up from 1', function () {
        showBoard();

        expect(firstSight('card-1:gold--0', 3, true)).toEqual({
            previous: undefined,
            placed: true,
            shown: 1
        });
    });

    it('places a single token, or a counter that does not count up, at its value', function () {
        showBoard();

        expect(firstSight('card-1:dupe--0', 1, true)).toMatchObject({ placed: true, shown: 1 });
        expect(firstSight('card-1:strength--0', 4, false)).toMatchObject({
            placed: true,
            shown: 4
        });
    });

    it('carries the last value over to a counter drawn again, so only a change shows', function () {
        showBoard();
        hold('card-1:card-power--0');
        remember('card-1:card-power--0', 2);

        expect(firstSight('card-1:card-power--0', 3, true)).toEqual({ previous: 2, shown: 3 });
    });

    it('forgets a counter that is gone, so it is placed again when it comes back', async function () {
        showBoard();
        hold('card-1:gold--0');
        remember('card-1:gold--0', 2);
        release('card-1:gold--0');
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(firstSight('card-1:gold--0', 2, true)).toMatchObject({ placed: true, shown: 1 });
    });

    it('keeps a counter that is drawn again in the same update', async function () {
        showBoard();
        hold('card-1:gold--0');
        remember('card-1:gold--0', 2);
        release('card-1:gold--0');
        hold('card-1:gold--0');
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(firstSight('card-1:gold--0', 2, true)).toEqual({ previous: 2, shown: 2 });
    });
});
