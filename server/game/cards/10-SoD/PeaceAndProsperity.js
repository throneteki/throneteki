import PlotCard from '../../plotcard.js';

class PeaceAndProsperity extends PlotCard {
    // Peace and Prosperity (10047)
    // Reduce the cost of the first character you marshal this round by 3, the first location your
    // marshal this round by 2, and the first attachment you marshal this round by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: [
                ability.effects.reduceFirstMarshalledCardCostEachRound(
                    3,
                    (card) => card.getType() === 'character'
                ),
                ability.effects.reduceFirstMarshalledCardCostEachRound(
                    2,
                    (card) => card.getType() === 'location'
                ),
                ability.effects.reduceFirstMarshalledCardCostEachRound(
                    1,
                    (card) => card.getType() === 'attachment'
                )
            ]
        });
    }
}

PeaceAndProsperity.code = '10047';

export default PeaceAndProsperity;
