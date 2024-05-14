const DrawCard = require('../../drawcard.js');

class Appointed extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true });
        this.whileAttached({
            effect: [ability.effects.addIcon('intrigue'), ability.effects.addTrait('Small Council')]
        });
    }
}

Appointed.code = '05043';

module.exports = Appointed;
