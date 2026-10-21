import DrawCard from '../../drawcard.js';

class RenlyBaratheon extends DrawCard {
    // Renly Baratheon (02007)
    // Reduce the cost of the first non-[baratheon] character you marshal each round by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledCardCostEachRound(
                1,
                (card) => card.getType() === 'character' && !card.isFaction('baratheon')
            )
        });
    }
}

RenlyBaratheon.code = '02007';

export default RenlyBaratheon;
