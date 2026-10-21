import DrawCard from '../../drawcard.js';

class CrownOfGold extends DrawCard {
    // Crown of Gold (02034)
    // Terminal.
    // Attached character gains the King trait.
    // Attached character gets -4 STR and is killed if its STR is 0.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.addTrait('King'), ability.effects.killByStrength(-4)]
        });
    }
}

CrownOfGold.code = '02034';

export default CrownOfGold;
