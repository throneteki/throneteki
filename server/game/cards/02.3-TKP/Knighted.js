import DrawCard from '../../drawcard.js';

class Knighted extends DrawCard {
    // Knighted (02058)
    // Attached character gets +1 STR and gains the Knight trait.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyStrength(1), ability.effects.addTrait('Knight')]
        });
    }
}

Knighted.code = '02058';

export default Knighted;
