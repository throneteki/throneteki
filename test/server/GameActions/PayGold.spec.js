import AbilityContext from '../../../server/game/AbilityContext.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('payGold game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], gold: 3 }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.hedgeKnight
        });
        this.paid = [];
        this.game.on('onGoldPaid', (event) => this.paid.push(event));
        this.pay = (props) => {
            this.game.resolveGameAction(GameActions.payGold(props), this.context);
            this.game.continue();
        };
    });

    it("pays gold from the player's gold pool", function () {
        this.pay({ player: this.player1Object, amount: 2 });

        expect(this.player1Object.gold).toBe(1);
        expect(this.paid).toHaveLength(1);
        expect(this.paid[0].amount).toBe(2);
    });

    it('cannot change the game state when the player cannot pay all of it', function () {
        const action = GameActions.payGold({ player: this.player1Object, amount: 4 });

        expect(action.allow(this.context)).toBe(false);
    });

    it('cannot change the game state for no gold', function () {
        const action = GameActions.payGold({ player: this.player1Object, amount: 0 });

        expect(action.allow(this.context)).toBe(false);
    });
});
