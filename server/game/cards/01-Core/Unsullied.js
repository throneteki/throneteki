const DrawCard = require('../../drawcard.js');

class Unsullied extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: (card) => card.isDefending(),
            targetController: 'opponent',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

Unsullied.code = '01171';

module.exports = Unsullied;
