import DrawCard from '../../drawcard.js';

class SelyseBaratheon extends DrawCard {
    // Selyse Baratheon (17101)
    // Reduce the cost of the first R'hllor attachment you marshal each round by 3.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledCardCostEachRound(
                3,
                (card) => card.getType() === 'attachment' && card.hasTrait("R'hllor")
            )
        });
    }
}

SelyseBaratheon.code = '17101';

export default SelyseBaratheon;
