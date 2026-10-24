import DelayedEffect from '../../../server/game/DelayedEffect.js';

describe('a delayed instruction affecting several cards', function () {
    it('creates simultaneous events and leaves out cards whose delayed part no longer applies', function () {
        const game = { resolveEvent: vi.fn() };
        const events = [{ card: 'first' }, { card: 'second' }];
        const group = [true, true, false].map((allowed, index) => ({
            delayedEffect: new DelayedEffect({
                context: { game, source: {}, player: {} },
                when: {},
                gameAction: { allow: () => allowed, createEvent: () => events[index] }
            }),
            event: {}
        }));
        DelayedEffect.resolveGroup(group);
        expect(game.resolveEvent).toHaveBeenCalledOnce();
        expect(game.resolveEvent.mock.calls[0][0].childEvents).toEqual(events);
    });
});
