import Costs from '../../../server/game/costs.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('a game action on a card chosen by a cost', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Hedge Knight', 'Tumblestone Knight'] }
        });

        this.hedgeKnight.action({
            title: 'Kneel and stand a character',
            cost: Costs.kneel((card, context) => card !== context.source),
            gameAction: GameActions.standCard((context) => ({ card: context.costs.kneel }))
        });
    });

    it('is offered before the cost is paid, and resolves on the chosen card', function () {
        this.player1.clickMenu(this.hedgeKnight, 'Kneel and stand a character');
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
