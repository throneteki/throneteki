import PlotCard from '../../plotcard.js';

class ANobleCause extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledCardCostEachRound(
                2,
                (card) => card.hasTrait('Lord') || card.hasTrait('Lady')
            )
        });
    }
}

ANobleCause.code = '01004';

export default ANobleCause;
