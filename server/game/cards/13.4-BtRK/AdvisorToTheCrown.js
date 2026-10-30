import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class AdvisorToTheCrown extends DrawCard {
    // Advisor to the Crown (13077)
    // Action: Kneel Advisor to the Crown to reduce the cost of the next Maester character you
    // marshal this phase by 1.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            cost: ability.costs.kneelSelf(),
            message: '{player} uses {source} to reduce the cost of the next Maester character by 1',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextMarshalledCardCost(
                    1,
                    (card) => card.getType() === 'character' && card.hasTrait('Maester')
                )
            }))
        });
    }
}

AdvisorToTheCrown.code = '13077';

export default AdvisorToTheCrown;
