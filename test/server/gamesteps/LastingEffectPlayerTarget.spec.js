import AbilityDsl from '../../../server/game/abilitydsl.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('a lasting effect on a player', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Roseroad'] }
        });

        this.theRoseroad.lastingEffect(() => ({
            until: { onPhaseEnded: () => true },
            targetController: 'any',
            match: (player) => player === this.player1Object,
            effect: AbilityDsl.effects.cannotGainGold()
        }));
        this.game.resolveGameAction(
            GameActions.takeControl({ card: this.theRoseroad, player: this.player2Object })
        );
        this.game.continue();
    });

    it('stays on that player when its source changes control', function () {
        expect(this.theRoseroad.controller).toBe(this.player2Object);
        expect(this.player1Object.canGainGold()).toBe(false);
        expect(this.player2Object.canGainGold()).toBe(true);
    });
});
