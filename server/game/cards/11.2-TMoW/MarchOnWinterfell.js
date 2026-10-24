import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MarchOnWinterfell extends DrawCard {
    // March on Winterfell (11028)
    // Play only during a challenge you initiated.
    // Action: End the challenge with no winner or loser. You may initiate an additional [power]
    // challenge this phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'End the challenge',
            condition: (context) =>
                context.game.isDuringChallenge({ attackingPlayer: context.player }),
            message:
                '{player} plays {source} to end this challenge with no winner or loser and be able to initiate an additional power challenge this phase',
            gameAction: GameActions.simultaneously([
                GameActions.endChallenge((context) => ({
                    challenge: context.game.currentChallenge
                })),
                GameActions.lastingEffect(() => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge('power')
                }))
            ])
        });
    }
}

MarchOnWinterfell.code = '11028';

export default MarchOnWinterfell;
