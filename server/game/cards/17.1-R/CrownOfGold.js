import DrawCard from '../../drawcard.js';

class CrownOfGold extends DrawCard {
    // Crown of Gold (17134)
    // Prized 1. Terminal.
    // Attached character gains the King trait and gets -4 STR.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.addTrait('King'), ability.effects.modifyStrength(-4)]
        });
    }
}

CrownOfGold.code = '17134';

export default CrownOfGold;
