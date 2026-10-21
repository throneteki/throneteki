import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SweetCersei extends DrawCard {
    // Sweet Cersei (08070)
    // During the challenges phase, you may spend gold on Sweet Cersei as if it were in your gold
    // pool.
    // Reaction: After you win an [intrigue] challenge, move 1 gold from the treasury to Sweet
    // Cersei.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'challenge',
            match: this,
            effect: ability.effects.canSpendGold(
                (spendParams) => spendParams.activePlayer === this.controller
            )
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            message: '{player} uses {source} to place 1 gold from the treasury on {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: this, token: Tokens.gold })),
                    context
                );
            }
        });
    }
}

SweetCersei.code = '08070';

export default SweetCersei;
