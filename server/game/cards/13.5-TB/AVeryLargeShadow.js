import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AVeryLargeShadow extends DrawCard {
    // A Very Large Shadow (13090)
    // Shadow (0).
    // Action: Reduce the cost of the next card you bring out of shadows this phase by 3. If there
    // is a Scheme plot card revealed, return A Very Large Shadow to your hand instead of placing it
    // in your discard pile. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.action({
            max: ability.limit.perPhase(1),
            message:
                '{player} plays {source} to reduce the cost of the next card {player} brings out of shadows this phase by 3',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect(() => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'current',
                    effect: ability.effects.reduceNextOutOfShadowsCardCost(3)
                })),
                GameActions.ifCondition({
                    condition: (context) => context.game.anyPlotHasTrait('Scheme'),
                    thenAction: {
                        message:
                            '{player} returns {source} to their hand instead of their discard pile',
                        gameAction: GameActions.returnCardToHand((context) => ({
                            card: context.source
                        }))
                    }
                })
            ])
        });
    }
}

AVeryLargeShadow.code = '13090';

export default AVeryLargeShadow;
