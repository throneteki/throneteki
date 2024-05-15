import PlotCard from '../../plotcard.js';

class PeaceAndProsperity extends PlotCard {
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
