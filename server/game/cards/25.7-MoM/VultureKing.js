const DrawCard = require('../../drawcard.js');

class VultureKing extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.parent && this.parent.isAttacking(),
            match: card => card.isDefending() && !card.hasIcon('intrigue'),
            targetController: 'any',
            effect: ability.effects.removeIcon('power')
        });
    }
}

VultureKing.code = '25546';
VultureKing.version = '1.0';

module.exports = VultureKing;
