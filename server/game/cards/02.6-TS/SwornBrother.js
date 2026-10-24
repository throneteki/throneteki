import DrawCard from '../../drawcard.js';

class SwornBrother extends DrawCard {
    // Sworn Brother (02105)
    // No attachments except Weapon.
    // Reduce the cost of the first location you marshal each round by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledCardCostEachRound(
                1,
                (card) => card.getType() === 'location'
            )
        });
    }
}

SwornBrother.code = '02105';

export default SwornBrother;
