import DrawCard from '../../drawcard.js';

class Reckless extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.mustBeDeclaredAsAttacker(),
                ability.effects.mustBeDeclaredAsDefender()
            ]
        });
    }
}

Reckless.code = '12043';

export default Reckless;
