import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreatHall extends DrawCard {
    // Great Hall (17144)
    // Limited.
    // Marshaling Action: Kneel Great Hall to reduce the cost of the next unique character you
    // marshal this phase by 1. (By 2 instead if that character's printed cost is 6 or higher.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next unique character',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to reduce the cost of the next unique character by 1 (by 2 if it has cost of 6 or more)',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextMarshalledCardCost(
                    (card) => (card.getPrintedCost() >= 6 ? 2 : 1),
                    (card) => card.getType() === 'character' && card.isUnique()
                )
            }))
        });
    }
}

GreatHall.code = '17144';

export default GreatHall;
