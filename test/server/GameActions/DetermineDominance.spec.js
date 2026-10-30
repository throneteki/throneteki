import DetermineDominance from '../../../server/game/GameActions/DetermineDominance.js';
import DetermineDominanceStep from '../../../server/game/gamesteps/DetermineDominance.js';

describe('DetermineDominance', function () {
    beforeEach(function () {
        this.game = { queueStep: vi.fn() };
        this.source = {};
        this.props = { context: { game: this.game, source: this.source } };
    });

    it('is always allowed', function () {
        expect(DetermineDominance.allow(this.props)).toBe(true);
    });

    it('queues a dominance determination when the event resolves', function () {
        const event = DetermineDominance.createEvent(this.props);
        event.executeHandler();

        expect(this.game.queueStep).toHaveBeenCalledWith(expect.any(DetermineDominanceStep));
        expect(this.game.queueStep.mock.calls[0][0].reason).toBe(this.source);
    });
});
