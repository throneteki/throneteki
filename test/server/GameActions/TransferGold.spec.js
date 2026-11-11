import AbilityContext from '../../../server/game/AbilityContext.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('transferGold game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Frey Bastard', gold: 2 }, 'Black Walder'],
                gold: 3
            },
            player2: { gold: 1 }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.freyBastard
        });
        this.transferred = [];
        this.game.on('onGoldTransferred', (event) => this.transferred.push(event));
        this.transfer = (props) => {
            this.game.resolveGameAction(GameActions.transferGold(props), this.context);
            this.game.continue();
        };
    });

    it('moves gold from a card to another card', function () {
        this.transfer({ from: this.freyBastard, to: this.blackWalder, amount: 1 });

        expect(this.freyBastard.gold).toBe(1);
        expect(this.blackWalder.gold).toBe(1);
        expect(this.transferred).toHaveLength(1);
        expect(this.transferred[0].amount).toBe(1);
    });

    it("moves gold from a player's gold pool to a card", function () {
        this.transfer({ from: this.player1Object, to: this.blackWalder, amount: 2 });

        expect(this.player1Object.gold).toBe(1);
        expect(this.blackWalder.gold).toBe(2);
    });

    it("moves gold from one player's gold pool to another's", function () {
        this.transfer({ from: this.player2Object, to: this.player1Object, amount: 1 });

        expect(this.player2Object.gold).toBe(0);
        expect(this.player1Object.gold).toBe(4);
    });

    it('moves only as much gold as the source has', function () {
        this.transfer({ from: this.freyBastard, to: this.player1Object, amount: 5 });

        expect(this.freyBastard.gold).toBe(0);
        expect(this.player1Object.gold).toBe(5);
        expect(this.transferred[0].amount).toBe(2);
    });

    it('cannot change the game state when the source has no gold', function () {
        const action = GameActions.transferGold({
            from: this.blackWalder,
            to: this.player1Object,
            amount: 1
        });

        expect(action.allow(this.context)).toBe(false);
    });
});
