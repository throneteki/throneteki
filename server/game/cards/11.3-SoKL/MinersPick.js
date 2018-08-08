const DrawCard = require('../../drawcard.js');

class MinersPick extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Builder', 'Steward'] });
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

MinersPick.code = '11046';

module.exports = MinersPick;
