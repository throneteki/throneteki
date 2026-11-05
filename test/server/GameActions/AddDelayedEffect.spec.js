import AddDelayedEffect from '../../../server/game/GameActions/AddDelayedEffect.js';

describe('AddDelayedEffect', function () {
    it('evaluates a property factory once and retains the original chosen card', function () {
        const first = {};
        const second = {};
        const context = { target: first, source: {}, game: { addDelayedEffect: vi.fn() } };
        const factory = vi.fn((context) => {
            const card = context.target;
            return {
                when: { onAtEndOfPhase: () => true },
                gameAction: { allow: () => true, createEvent: () => ({ card }) }
            };
        });
        new AddDelayedEffect(factory).createEvent(context).executeHandler();
        context.target = second;
        const delayed = context.game.addDelayedEffect.mock.calls[0][0];
        expect(factory).toHaveBeenCalledOnce();
        expect(delayed.gameAction.createEvent().card).toBe(first);
    });
});
