import AddPhase from '../../../server/game/GameActions/AddPhase.js';

describe('AddPhase', function () {
    beforeEach(function () {
        this.game = { addPhase: vi.fn() };
        this.props = { phase: 'challenge', context: { game: this.game } };
    });

    it('is always allowed', function () {
        expect(AddPhase.allow(this.props)).toBe(true);
    });

    it('creates an onPhaseAdded event that adds the phase', function () {
        const event = AddPhase.createEvent(this.props);

        expect(event.name).toBe('onPhaseAdded');
        expect(event.phase).toBe('challenge');

        event.executeHandler();
        expect(this.game.addPhase).toHaveBeenCalledWith('challenge');
    });
});
