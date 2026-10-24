import DrawCard from '../../drawcard.js';

class Reckless extends DrawCard {
    // Reckless (12043)
    // Terminal.
    // Attached character must be declared as an attacker or defender in each challenge, if able.
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
