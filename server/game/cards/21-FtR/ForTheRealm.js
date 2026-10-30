import PlotCard from '../../plotcard.js';

class ForTheRealm extends PlotCard {
    // For the Realm (21029)
    // Reduce the cost of the first Army or Stronghold card you marshal this round by 4.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledCardCostEachRound(
                4,
                (card) => card.hasTrait('Army') || card.hasTrait('Stronghold')
            )
        });
    }
}

ForTheRealm.code = '21029';

export default ForTheRealm;
