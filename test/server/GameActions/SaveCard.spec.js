import GameActions from '../../../server/game/GameActions/index.js';

describe('saveCard game action', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Hedge Knight'] } });
        this.killEvent = (props) => ({ card: this.hedgeKnight, cancelled: false, ...props });
    });

    it('can save a card from a kill that allows saves', function () {
        const event = this.killEvent({ allowSave: true });

        expect(GameActions.saveCard({ event }).allow({})).toBe(true);
    });

    it('cannot save a card from a burn kill', function () {
        const event = this.killEvent({ allowSave: false, isBurn: true });

        expect(GameActions.saveCard({ event }).allow({})).toBe(false);
    });

    it('can save a card from a burn kill when the save remedies it', function () {
        const event = this.killEvent({ allowSave: false, isBurn: true });

        expect(GameActions.saveCard({ event, remediesBurn: true }).allow({})).toBe(true);
    });

    it('cannot save a card from another kill that does not allow saves, even if it remedies burn', function () {
        const event = this.killEvent({ allowSave: false, isBurn: false });

        expect(GameActions.saveCard({ event, remediesBurn: true }).allow({})).toBe(false);
    });
});
