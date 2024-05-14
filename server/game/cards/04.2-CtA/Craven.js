import DrawCard from '../../drawcard.js';

class Craven extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        });
    }
}

Craven.code = '04026';

export default Craven;
