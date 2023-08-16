const DrawCard = require('../../drawcard.js');

class SerArysOakheart extends DrawCard {    
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            targetController: 'any',
            effect: ability.effects.setDefenderMinimum(1)
        });
    }
}

SerArysOakheart.code = '25538';
SerArysOakheart.version = '1.0';

module.exports = SerArysOakheart;
