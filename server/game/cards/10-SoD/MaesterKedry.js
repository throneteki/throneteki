import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class MaesterKedry extends DrawCard {
    // Maester Kedry (10014)
    // Action: Kneel Maester Kedry to reduce the gold cost of the next event you play this phase by
    // 2.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next event by 2',
            clickToActivate: true,
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to reduce the cost of the next event they play this phase by 2',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextPlayedCardCost(2)
            }))
        });
    }
}

MaesterKedry.code = '10014';

export default MaesterKedry;
