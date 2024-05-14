const DrawCard = require('../../drawcard');

class PrincesAttendant extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next marshalled character',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to reduce the cost of the next Martell Lord or Lady they marshal this phase by 2',
            handler: () => {
                this.untilEndOfPhase((ability) => ({
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        2,
                        (card) =>
                            (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                            card.getType() === 'character' &&
                            card.isFaction('martell')
                    )
                }));
            }
        });
    }
}

PrincesAttendant.code = '14029';

module.exports = PrincesAttendant;
