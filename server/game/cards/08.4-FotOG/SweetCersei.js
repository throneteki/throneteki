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
            condition: (context) => context.game.currentPhase === 'challenge',
            match: (card, context) => card === context.source,
            effect: ability.effects.canSpendGold(
                (spendParams, context) => spendParams.activePlayer === context.source.controller
            )
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            message: '{player} uses {source} to place 1 gold from the treasury on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.gold
            }))
        });
    }
}

SweetCersei.code = '08070';

export default SweetCersei;
