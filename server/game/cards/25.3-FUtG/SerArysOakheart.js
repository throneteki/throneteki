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

SerArysOakheart.code = '25047';

module.exports = SerArysOakheart;
