import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class PrincesAttendant extends DrawCard {
    // Prince's Attendant (14029)
    // Marshaling Action: Kneel Prince's Attendant to reduce the cost of the next [martell] Lord or
    // Lady character you marshal this phase by 2.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next marshalled character',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to reduce the cost of the next Martell Lord or Lady they marshal this phase by 2',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                effect: ability.effects.reduceNextMarshalledCardCost(
                    2,
                    (card) =>
                        (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                        card.getType() === 'character' &&
                        card.isFaction('martell')
                )
            }))
        });
    }
}

PrincesAttendant.code = '14029';

export default PrincesAttendant;
