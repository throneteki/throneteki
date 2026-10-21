import DrawCard from '../../drawcard.js';

class MaesterKedry extends DrawCard {
    // Maester Kedry (10014)
    // Action: Kneel Maester Kedry to reduce the gold cost of the next event you play this phase by
    // 2.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next event by 2',
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.reduceNextPlayedCardCost(2)
                }));

                this.game.addMessage(
                    '{0} kneels {1} to reduce the cost of the next event they play this phase by 2',
                    context.player,
                    this
                );
            }
        });
    }
}

MaesterKedry.code = '10014';

export default MaesterKedry;
