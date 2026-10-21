import DrawCard from '../../drawcard.js';

class MarchOnWinterfell extends DrawCard {
    // March on Winterfell (11028)
    // Play only during a challenge you initiated.
    // Action: End the challenge with no winner or loser. You may initiate an additional [power]
    // challenge this phase.
    setupCardAbilities() {
        this.action({
            title: 'End the challenge',
            condition: () => this.game.isDuringChallenge({ attackingPlayer: this.controller }),
            handler: (context) => {
                this.game.currentChallenge.cancelChallenge();

                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge('power')
                }));

                this.game.addMessage(
                    '{0} plays {1} to end this challenge with no winner or loser',
                    context.player,
                    this
                );
                this.game.addMessage(
                    '{0} may initiate an additional {1} challenge this phase',
                    context.player,
                    'power'
                );
            }
        });
    }
}

MarchOnWinterfell.code = '11028';

export default MarchOnWinterfell;
