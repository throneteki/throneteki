import {
    holdAfterReturns,
    keyframesFor,
    landingFrames,
    planFlip,
    flipConfig,
    scheduleFlip,
    sequenceDelays
} from '../../client/flip.js';

const card = (left, top, extra = {}) => ({
    el: { isConnected: true },
    left,
    top,
    width: 64,
    height: 90,
    slot: { left, top, width: 64, height: 90 },
    rot: 0,
    ...extra
});

describe('planFlip', function () {
    it('moves a card from where it was to where it is now', function () {
        const before = new Map([['a', card(100, 200)]]);
        const after = new Map([['a', card(300, 50)]]);

        const plan = planFlip({ before, after });

        expect(plan).toHaveLength(1);
        expect(plan[0]).toMatchObject({ type: 'move', dx: -200, dy: 150 });
    });

    it('moves only the carried card back, leaving what is attached to it where it is', function () {
        const slotEl = { id: 'slot' };
        const before = new Map([['a', card(300, 400, { el: null, solo: true })]]);
        const after = new Map([
            [
                'a',
                card(100, 160, {
                    slotEl,
                    holdsCards: true,
                    slot: { left: 100, top: 200, width: 64, height: 90 }
                })
            ]
        ]);

        const plan = planFlip({ before, after });

        expect(plan[0]).toMatchObject({ el: slotEl, dx: 200, dy: 200 });
    });

    it('moves a carried card with nothing on it as a whole', function () {
        const before = new Map([['a', card(300, 400, { el: null, solo: true })]]);
        const after = new Map([['a', card(100, 200, { slotEl: {}, holdsCards: false })]]);

        expect(planFlip({ before, after })[0]).toMatchObject({ dx: 200, dy: 200 });
        expect(planFlip({ before, after })[0].el).toBe(after.get('a').el);
    });

    it('ignores cards that have not moved', function () {
        const before = new Map([['a', card(100, 200)]]);
        const after = new Map([['a', card(100.4, 200.3)]]);

        expect(planFlip({ before, after })).toEqual([]);
    });

    it('draws a new hand card from its owner draw deck', function () {
        const before = new Map([['x', card(0, 0)]]);
        const after = new Map([
            ['x', card(0, 0)],
            ['new', card(500, 400, { from: 'alice' })]
        ]);
        const decks = new Map([['alice', { left: 700, top: 380 }]]);

        const plan = planFlip({ before, after, decks });

        expect(plan).toHaveLength(1);
        expect(plan[0]).toMatchObject({ type: 'move', dx: 200, dy: -20 });
    });

    it('fades in a new card with no known origin', function () {
        const before = new Map([['x', card(0, 0)]]);
        const after = new Map([
            ['x', card(0, 0)],
            ['new', card(500, 400)]
        ]);

        expect(planFlip({ before, after }).map((item) => item.type)).toEqual(['fade']);
    });

    it('exits a card that was removed from the page', function () {
        const gone = card(10, 20, { el: { isConnected: false } });
        const before = new Map([
            ['x', card(0, 0)],
            ['gone', gone]
        ]);
        const after = new Map([['x', card(0, 0)]]);

        const plan = planFlip({ before, after });

        expect(plan).toHaveLength(1);
        expect(plan[0]).toMatchObject({ type: 'exit', rect: gone });
    });

    it('plays nothing when there was no earlier board to compare with', function () {
        const after = new Map([['a', card(1, 2)]]);

        expect(planFlip({ before: new Map(), after })).toEqual([]);
        expect(planFlip({ before: null, after })).toEqual([]);
    });
});

describe('rotation and scheduling', function () {
    it('turns a card that is rebuilt in a rotated position', function () {
        const before = new Map([['a', card(100, 200, { source: 'play area' })]]);
        const dead = card(400, 300, {
            source: 'dead pile',
            rot: 90,
            slot: { left: 400, top: 310, width: 90, height: 64 }
        });
        const after = new Map([['a', dead]]);

        const [move] = planFlip({ before, after });

        expect(move).toMatchObject({ type: 'move', rotate: -90, travel: true });
        expect(move.dx).toBeCloseTo(132 - 445);
        expect(move.dy).toBeCloseTo(245 - 342);
        expect(move.origin).toEqual({ x: 445 - 400, y: 342 - 300 });
    });

    it('does not turn a card that is the same element, as kneeling is a transition', function () {
        const el = { isConnected: true };
        const before = new Map([['a', card(100, 200, { el })]]);
        const after = new Map([['a', card(100, 260, { el, rot: 90 })]]);

        expect(planFlip({ before, after })[0]).toMatchObject({ rotate: 0, dy: -60 });
    });

    it('closes the gap as the only card leaves, at the same moment it moves', function () {
        const before = new Map([
            ['leaves', card(100, 0, { source: 'hand' })],
            ['stay', card(200, 0, { source: 'hand' })]
        ]);
        const after = new Map([
            ['stay', card(100, 0, { source: 'hand' })],
            ['leaves', card(500, 300, { source: 'play area' })]
        ]);

        const scheduled = scheduleFlip(planFlip({ before, after }));

        expect(scheduled.map((item) => item.delay)).toEqual([0, 0]);
    });

    it('sends several cards one at a time, whichever areas they move between', function () {
        const before = new Map([
            ['a', card(0, 0, { source: 'hand' })],
            ['b', card(100, 0, { source: 'hand' })],
            ['c', card(200, 0, { source: 'hand' })],
            ['d', card(300, 0, { source: 'hand' })]
        ]);
        const after = new Map([
            ['a', card(0, 0, { source: 'hand' })],
            ['b', card(500, 300, { source: 'discard pile' })],
            ['c', card(100, 0, { source: 'hand' })],
            ['d', card(500, 300, { source: 'discard pile' })]
        ]);

        const scheduled = scheduleFlip(planFlip({ before, after }));
        const byEl = (uuid) => scheduled.find((item) => item.el === after.get(uuid).el);

        expect(byEl('b')).toMatchObject({ delay: 0, duration: 320 });
        expect(byEl('d')).toMatchObject({ delay: 380, duration: 320 });
    });

    it('closes up a gap when the card ahead of it leaves, not before', function () {
        const before = new Map([
            ['a', card(0, 0, { source: 'hand' })],
            ['b', card(100, 0, { source: 'hand' })],
            ['c', card(200, 0, { source: 'hand' })],
            ['d', card(300, 0, { source: 'hand' })]
        ]);
        const after = new Map([
            ['a', card(0, 0, { source: 'hand' })],
            ['b', card(500, 300, { source: 'discard pile' })],
            ['c', card(100, 0, { source: 'hand' })],
            ['d', card(500, 300, { source: 'discard pile' })]
        ]);

        const scheduled = scheduleFlip(planFlip({ before, after }));
        const shift = scheduled.find((item) => item.el === after.get('c').el);

        expect(shift).toMatchObject({ delay: 0, duration: 320 });
        expect(shift.travel).toBe(false);
    });

    it('spreads a shift across every card that leaves ahead of it', function () {
        const before = new Map([
            ['a', card(0, 0, { source: 'hand' })],
            ['b', card(100, 0, { source: 'hand' })],
            ['c', card(200, 0, { source: 'hand' })]
        ]);
        const after = new Map([
            ['a', card(500, 300, { source: 'discard pile' })],
            ['b', card(500, 300, { source: 'discard pile' })],
            ['c', card(0, 0, { source: 'hand' })]
        ]);

        const scheduled = scheduleFlip(planFlip({ before, after }));
        const shift = scheduled.find((item) => item.el === after.get('c').el);

        expect(shift).toMatchObject({ delay: 0, duration: 380 + 320 });
    });

    it('opens a slot in a row when cards arrive in it, as each one starts', function () {
        const before = new Map([
            ['x', card(0, 0, { source: 'play area' })],
            ['y', card(100, 0, { source: 'play area' })],
            ['p', card(0, 300, { source: 'hand' })],
            ['q', card(100, 300, { source: 'hand' })]
        ]);
        const after = new Map([
            ['x', card(0, 0, { source: 'play area' })],
            ['p', card(100, 0, { source: 'play area' })],
            ['q', card(200, 0, { source: 'play area' })],
            ['y', card(300, 0, { source: 'play area' })]
        ]);

        const scheduled = scheduleFlip(planFlip({ before, after }));
        const shift = scheduled.find((item) => item.el === after.get('y').el);

        expect(shift).toMatchObject({ delay: 0, duration: 380 + 320 });
    });

    it('draws one card at a time, each after the previous one lands', function () {
        const before = new Map([['x', card(0, 0)]]);
        const after = new Map([
            ['x', card(0, 0)],
            ['d1', card(500, 400, { from: 'alice' })],
            ['d2', card(560, 400, { from: 'alice' })],
            ['d3', card(620, 400, { from: 'alice' })]
        ]);
        const decks = new Map([['alice', { left: 700, top: 380 }]]);

        const scheduled = scheduleFlip(planFlip({ before, after, decks }));

        expect(scheduled.map((item) => item.delay)).toEqual([0, 380, 760]);
        expect(scheduled[1].delay - scheduled[0].delay).toBeGreaterThanOrEqual(
            scheduled[0].duration
        );
    });

    it('moves a revealed plot from its plot deck without drawing it sequentially', function () {
        const before = new Map([['x', card(0, 0)]]);
        const after = new Map([
            ['x', card(0, 0)],
            ['plot', card(100, 50, { from: 'plots:alice' })]
        ]);
        const decks = new Map([['plots:alice', { left: 100, top: 200 }]]);

        const [move] = scheduleFlip(planFlip({ before, after, decks }));

        expect(move).toMatchObject({ type: 'move', dy: 150, delay: 0 });
        expect(move.sequential).toBeFalsy();
    });
});

describe('cards that leave for a pile', function () {
    const gone = (left, top, source) => card(left, top, { source, el: { isConnected: false } });
    const pile = { source: 'discard pile', left: 800, top: 500 };

    it('flies a removed card to the pile it was moved into', function () {
        const before = new Map([
            ['x', card(0, 0)],
            ['b', gone(100, 0, 'hand')]
        ]);
        const after = new Map([['x', card(0, 0)]]);

        const [ghost] = planFlip({ before, after, findPile: () => pile });

        expect(ghost).toMatchObject({ type: 'ghost', dx: 700, dy: 500, travel: true });
    });

    it('fades a removed card when no pile has it', function () {
        const before = new Map([
            ['x', card(0, 0)],
            ['b', gone(100, 0, 'hand')]
        ]);
        const after = new Map([['x', card(0, 0)]]);

        expect(planFlip({ before, after })[0].type).toBe('exit');
    });

    it('discards several cards from a hand one at a time, closing the gap with each', function () {
        const before = new Map([
            ['a', card(0, 0, { source: 'hand' })],
            ['b', gone(100, 0, 'hand')],
            ['c', card(200, 0, { source: 'hand' })],
            ['d', gone(300, 0, 'hand')]
        ]);
        const after = new Map([
            ['a', card(0, 0, { source: 'hand' })],
            ['c', card(100, 0, { source: 'hand' })]
        ]);

        const scheduled = scheduleFlip(planFlip({ before, after, findPile: () => pile }));
        const ghosts = scheduled.filter((item) => item.type === 'ghost');

        expect(ghosts.map((item) => item.delay)).toEqual([0, 380]);
        expect(scheduled.find((item) => item.el === after.get('c').el)).toMatchObject({
            delay: 0,
            duration: 320
        });
    });
});

describe('stacking onto a pile', function () {
    const gone = (left, source) => card(left, 0, { source, el: { isConnected: false } });
    const depths = { deep: 2, middle: 1 };
    const findPile = (uuid) => ({
        source: 'discard pile',
        left: 800,
        top: 500,
        depth: depths[uuid]
    });

    it('sends the deepest cards first so the card that stays on top lands last', function () {
        const before = new Map([
            ['top', card(0, 0, { source: 'hand' })],
            ['middle', gone(100, 'hand')],
            ['deep', gone(200, 'hand')]
        ]);
        const after = new Map([['top', card(500, 300, { source: 'discard pile' })]]);

        const scheduled = scheduleFlip(planFlip({ before, after, findPile }));
        const order = [...scheduled].sort((a, b) => a.delay - b.delay);

        expect(order.map((item) => item.type)).toEqual(['ghost', 'ghost', 'move']);
        expect(order[0].dx).toBe(800 - 200);
        expect(order[1].dx).toBe(800 - 100);
    });

    it('ignores a card that was removed without an element to animate', function () {
        const before = new Map([
            ['x', card(0, 0)],
            ['carried', card(5, 5, { el: null })]
        ]);
        const after = new Map([['x', card(0, 0)]]);

        expect(planFlip({ before, after })).toEqual([]);
    });
});

describe('attachments and duplicates', function () {
    it('slides an attachment from the hand to under its card', function () {
        const before = new Map([
            ['parent', card(300, 300, { source: 'play area' })],
            ['aura', card(50, 600, { source: 'hand' })]
        ]);
        const after = new Map([
            ['parent', card(300, 300, { source: 'play area' })],
            ['aura', card(300, 420, { source: 'attached', parent: 'parent' })]
        ]);

        const [move] = planFlip({ before, after });

        expect(move).toMatchObject({
            type: 'move',
            dx: -250,
            dy: 180,
            travel: true,
            nested: true
        });
    });

    it('does not move an attachment twice when its card moves', function () {
        const before = new Map([
            ['parent', card(300, 300, { source: 'play area' })],
            ['aura', card(300, 420, { source: 'attached', parent: 'parent' })]
        ]);
        const after = new Map([
            ['parent', card(400, 300, { source: 'play area' })],
            ['aura', card(400, 420, { source: 'attached', parent: 'parent' })]
        ]);

        const plan = planFlip({ before, after });

        expect(plan).toHaveLength(1);
        expect(plan[0]).toMatchObject({ uuid: 'parent', dx: -100 });
    });

    it('flies an attachment away on its own when its card leaves play', function () {
        const gone = (uuid, left, top, parent) => [
            uuid,
            card(left, top, {
                source: parent ? 'attached' : 'play area',
                el: { isConnected: false }
            })
        ];
        const before = new Map([gone('parent', 300, 300), gone('aura', 300, 420, 'parent')]);
        const after = new Map([['x', card(0, 0)]]);
        const findPile = (uuid) => ({
            source: 'discard pile',
            left: 900,
            top: 100,
            depth: uuid === 'aura' ? 1 : 0
        });

        const plan = planFlip({ before: new Map([...before, ['x', card(0, 0)]]), after, findPile });

        expect(plan.map((item) => item.type)).toEqual(['ghost', 'ghost']);
        expect(plan[1]).toMatchObject({ dx: 600, dy: -320 });
    });
});

describe('putting a hand back into the deck', function () {
    const gone = (uuid, left) => [
        uuid,
        card(left, 600, { source: 'hand', from: 'alice', el: { isConnected: false } })
    ];
    const decks = new Map([['alice', { left: 900, top: 500 }]]);

    it('sends every card to the deck together, with no stagger', function () {
        const before = new Map([['x', card(0, 0)], gone('a', 0), gone('b', 70), gone('c', 140)]);
        const after = new Map([['x', card(0, 0)]]);

        const scheduled = scheduleFlip(planFlip({ before, after, decks }));
        const ghosts = scheduled.filter((item) => item.type === 'ghost');

        expect(ghosts).toHaveLength(3);
        expect(ghosts.every((item) => item.returning && item.delay === 0)).toBe(true);
        expect(new Set(ghosts.map((item) => item.duration)).size).toBe(1);
    });

    it('waits for the cards to return and the shuffle before the next hand is drawn', function () {
        const before = new Map([['x', card(0, 0)], gone('a', 0), gone('b', 70)]);
        const after = new Map([
            ['x', card(0, 0)],
            ['n1', card(0, 600, { source: 'hand', from: 'alice' })]
        ]);

        const plan = planFlip({ before, after, decks });
        const [draw] = scheduleFlip(plan).filter((item) => item.sequential);

        expect(holdAfterReturns(plan)).toBe(380 + 600);
        expect(draw.delay).toBe(980);
    });

    it('does not pause for a single card put back', function () {
        const before = new Map([['x', card(0, 0)], gone('a', 0)]);
        const after = new Map([['x', card(0, 0)]]);

        expect(holdAfterReturns(planFlip({ before, after, decks }))).toBe(0);
    });
});

describe('keyframesFor', function () {
    it('slides an attachment in level with its resting place, behind its card and the others on it', function () {
        const frames = keyframesFor({
            type: 'move',
            dx: 5,
            dy: 6,
            rotate: 0,
            travel: true,
            nested: true,
            z: 197
        });

        expect(frames.map((frame) => frame.zIndex)).toEqual(['197', '197']);
    });

    it('falls back to just under a card when the resting level is unknown', function () {
        const frames = keyframesFor({ type: 'move', dx: 1, dy: 1, rotate: 0, nested: true });

        expect(frames[0].zIndex).toBe('199');
    });

    it('keeps a drawn card hidden until its turn, then shows it at the deck', function () {
        const frames = keyframesFor({ type: 'move', dx: 5, dy: 6, rotate: 0, sequential: true });

        expect(frames[0]).toMatchObject({ opacity: 0, offset: 0 });
        expect(frames[1]).toMatchObject({ opacity: 1, transform: frames[0].transform });
        expect(frames[2].transform).toBe('translate(0, 0) rotate(0deg)');
    });

    it('keeps cards that only shift level with the rest of the hand', function () {
        const frames = keyframesFor({ type: 'move', dx: 5, dy: 6, rotate: 0, travel: false });

        expect(frames[0].zIndex).toBe('200');
    });

    it('keeps other moves visible while they wait', function () {
        const frames = keyframesFor({ type: 'move', dx: 5, dy: 6, rotate: 0, travel: true });

        expect(frames).toHaveLength(2);
        expect(frames[0].opacity).toBeUndefined();
        expect(frames[0].zIndex).toBe('205');
    });
});

describe('landingFrames', function () {
    it('lifts a travelling card, then drops it to its resting level before it arrives', function () {
        const frames = landingFrames({ type: 'move', travel: true });

        expect(frames.map((frame) => frame.zIndex)).toEqual(['205', '205', '200']);
        expect(frames[1].offset).toBeLessThan(1);
    });

    it('leaves cards that only shift and attachments alone', function () {
        expect(landingFrames({ type: 'move', travel: false })).toBeNull();
        expect(landingFrames({ type: 'move', travel: true, nested: true })).toBeNull();
    });
});

describe('sequenceDelays', function () {
    it('has no delay for a single card', function () {
        expect(sequenceDelays(1)).toEqual([0]);
        expect(sequenceDelays(0)).toEqual([]);
    });

    it('releases one card per step', function () {
        expect(sequenceDelays(3)).toEqual([0, 380, 760]);
    });

    it('shrinks the step so the total stays within the cap', function () {
        const delays = sequenceDelays(21);

        expect(delays[0]).toBe(0);
        expect(delays[20] + flipConfig.duration).toBeCloseTo(flipConfig.maxSequence);
    });
});
