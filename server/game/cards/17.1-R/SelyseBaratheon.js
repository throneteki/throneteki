import DrawCard from '../../drawcard.js';

class SelyseBaratheon extends DrawCard {
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
