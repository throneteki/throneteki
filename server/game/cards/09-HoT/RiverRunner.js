const DrawCard = require('../../drawcard.js');

class RiverRunner extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            targetController: 'any',
            match: (card) => card.getType() === 'character' && card.getPower() > 0,
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

RiverRunner.code = '09025';

module.exports = RiverRunner;
