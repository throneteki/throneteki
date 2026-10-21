import DrawCard from '../../drawcard.js';

class Craven extends DrawCard {
    // Craven (04026)
    // Terminal.
    // Attached character cannot be declared as an attacker.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        });
    }
}

Craven.code = '04026';

export default Craven;
