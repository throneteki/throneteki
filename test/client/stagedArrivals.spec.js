import {
    arrivalsToStage,
    stepForArrivals
} from '../../client/Components/GameBoard/useStagedArrivals.js';
import { flipConfig } from '../../client/flip.js';
import {
    hiddenUuid,
    incomingTarget,
    nextOver
} from '../../client/Components/GameBoard/dragStore.js';

describe('stepForArrivals', function () {
    it('has no step for a single card', function () {
        expect(stepForArrivals(1)).toBe(0);
    });

    it('releases one card per draw step', function () {
        expect(stepForArrivals(3)).toBe(380);
    });

    it('speeds up for very large draws so the total stays capped', function () {
        expect(stepForArrivals(21) * 20 + flipConfig.duration).toBeCloseTo(flipConfig.maxSequence);
    });
});

describe('carried card slot', function () {
    const carried = { uuid: 'a', source: 'hand', ghost: null };

    it('stays open while the card is over the area it came from', function () {
        expect(hiddenUuid({ ...carried, over: 'hand' })).toBeNull();
    });

    it('closes once another area is hovered', function () {
        expect(hiddenUuid({ ...carried, over: 'discard pile' })).toBe('a');
    });

    it('stays closed while the dropped card waits for the server', function () {
        expect(hiddenUuid({ ...carried, over: 'hand', ghost: {} })).toBe('a');
    });

    it('keeps the last area while over nothing', function () {
        expect(nextOver({ over: 'hand' }, null)).toBe('hand');
        expect(nextOver({ over: 'hand' }, 'play area')).toBe('play area');
    });
});

describe('slot for the carried card', function () {
    const carried = { uuid: 'a', source: 'discard pile', ghost: null };

    it('opens in the area being hovered when the card may be dropped there', function () {
        expect(incomingTarget({ ...carried, over: 'hand' })).toBe('hand');
        expect(incomingTarget({ ...carried, over: 'play area' })).toBe('play area');
    });

    it('stays shut over the area the card came from', function () {
        expect(incomingTarget({ ...carried, over: 'discard pile' })).toBeNull();
    });

    it('stays shut where the card cannot be dropped', function () {
        expect(incomingTarget({ ...carried, over: 'plot deck' })).toBeNull();
    });

    it('stays shut when nothing is being carried', function () {
        expect(incomingTarget({ uuid: null, source: null, over: 'hand' })).toBeNull();
    });
});

describe('arrivalsToStage', function () {
    const hand = (...ids) => ids.map((uuid) => ({ uuid }));
    const base = {
        previous: new Set(['a', 'b', 'c']),
        queued: 0,
        redeal: false,
        enabled: true,
        isOnBoard: () => false
    };

    it('holds back two or more new cards', function () {
        const staging = arrivalsToStage({ ...base, cards: hand('a', 'b', 'c', 'x', 'y') });

        expect(staging).toEqual({ add: ['x', 'y'] });
    });

    it('lets a single new card straight in', function () {
        expect(arrivalsToStage({ ...base, cards: hand('a', 'b', 'c', 'x') })).toEqual({});
    });

    it('does not hold back cards that came from the board', function () {
        const staging = arrivalsToStage({
            ...base,
            cards: hand('a', 'b', 'c', 'x', 'y'),
            isOnBoard: () => true
        });

        expect(staging).toEqual({});
    });

    it('deals the whole hand again when a setup hand is swapped, kept cards included', function () {
        const staging = arrivalsToStage({
            ...base,
            redeal: true,
            cards: hand('a', 'x', 'y', 'z')
        });

        expect(staging).toEqual({ replace: ['a', 'x', 'y', 'z'] });
    });

    it('does not redeal when cards only leave the hand', function () {
        const staging = arrivalsToStage({ ...base, redeal: true, cards: hand('a', 'b') });

        expect(staging).toEqual({});
    });

    it('does nothing when animations are off', function () {
        const staging = arrivalsToStage({
            ...base,
            enabled: false,
            redeal: true,
            cards: hand('x', 'y')
        });

        expect(staging).toEqual({});
    });
});
