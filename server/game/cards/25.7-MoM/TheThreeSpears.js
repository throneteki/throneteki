const DrawCard = require('../../drawcard.js');

class TheThreeSpears extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: card => card.name === 'Grey Worm',
            effect: [
                ability.effects.addIcon('power'),
                ability.effects.addKeyword('intimidate')
            ]
        });
        this.persistentEffect({
            condition: () => this.parent && this.parent.isAttacking(),
            match: card => card.isDefending(),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

TheThreeSpears.code = '25582';
TheThreeSpears.version = '1.0';

module.exports = TheThreeSpears;
