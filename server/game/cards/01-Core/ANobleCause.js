import PlotCard from '../../plotcard.js';

class ANobleCause extends PlotCard {
    // A Noble Cause (01004)
    // Reduce the cost of the first Lord or Lady character you marshal this round by 2.
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
