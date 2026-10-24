import CheckReserve from '../../../server/game/GameActions/CheckReserve.js';
import DiscardToReservePrompt from '../../../server/game/gamesteps/taxation/DiscardToReservePrompt.js';

describe('CheckReserve', function () {
    beforeEach(function () {
        this.game = { queueStep: vi.fn(), getPlayersInFirstPlayerOrder: () => [] };
        this.event = CheckReserve.createEvent({ context: { game: this.game, source: {} } });
    });

    it('does not prompt while the event handlers are resolving', function () {
        this.event.executeHandler();

        expect(this.game.queueStep).not.toHaveBeenCalled();
    });

    it('prompts to discard down to reserve once the event has resolved', function () {
        this.event.executeHandler();
        this.event.executePostHandler();

        expect(this.game.queueStep).toHaveBeenCalledWith(expect.any(DiscardToReservePrompt));
    });
});
