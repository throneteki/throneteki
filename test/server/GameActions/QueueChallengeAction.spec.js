import QueueChallengeAction from '../../../server/game/GameActions/QueueChallengeAction.js';

describe('QueueChallengeAction', function () {
    it('checks the eventual action without applying it before challenge redirection', function () {
        const action = { allow: vi.fn(() => true), createEvent: vi.fn() };
        const challenge = { addInitiationAction: vi.fn() };
        const properties = { action, challenge, source: {}, card: {} };
        expect(QueueChallengeAction.allow(properties)).toBe(true);
        QueueChallengeAction.createEvent(properties).executeHandler();
        expect(action.createEvent).not.toHaveBeenCalled();
        expect(challenge.addInitiationAction).toHaveBeenCalledWith(action, {
            challenge,
            source: properties.source,
            card: properties.card
        });
    });

    it('refuses an action that cannot affect the target', function () {
        expect(QueueChallengeAction.allow({ action: { allow: () => false } })).toBe(false);
    });
});
