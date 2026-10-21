import DrawCard from '../../drawcard.js';

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
                '{player} plays {source} to reduce the cost of the next card {player} brings out of shadows this phase by 3.',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.reduceNextOutOfShadowsCardCost(3)
                }));

                if (this.game.anyPlotHasTrait('Scheme')) {
                    this.game.addMessage(
                        '{0} uses {1} to return {1} to their hand instead of their discard pile',
                        context.player,
                        this
                    );
                    context.player.moveCard(this, 'hand');
                }
            }
        });
    }
}

AVeryLargeShadow.code = '13090';

export default AVeryLargeShadow;
