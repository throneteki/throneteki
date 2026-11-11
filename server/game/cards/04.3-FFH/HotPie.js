import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class HotPie extends DrawCard {
    // Hot Pie (04057)
    // Marshaling Action: Kneel a Companion character to reduce the cost of the next unique
    // character you marshal this phase by 1.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next marshalled character',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Companion') && card.getType() === 'character'
            ),
            message:
                '{player} uses {source} and kneels {costs.kneel} to reduce the cost of the next unique character they marshal this phase by 1',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                effect: ability.effects.reduceNextMarshalledCardCost(
                    1,
                    (card) => card.isUnique() && card.getType() === 'character'
                )
            }))
        });
    }
}

HotPie.code = '04057';

export default HotPie;
