import DrawCard from '../../drawcard.js';

class CrownOfGold extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.addTrait('King'), ability.effects.modifyStrength(-4)]
        });
    }
}

CrownOfGold.code = '17134';

export default CrownOfGold;
