import DrawCard from '../../drawcard.js';

class PriestOfTheDrownedGod extends DrawCard {
    // Priest of the Drowned God (02072)
    // Each Drowned God character you control gets +1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasTrait('Drowned God'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

PriestOfTheDrownedGod.code = '02072';

export default PriestOfTheDrownedGod;
