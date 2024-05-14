const DrawCard = require('../../drawcard.js');

class TheBloodroyal extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'martell' });
        this.whileAttached({
            condition: () => !this.controller.firstPlayer,
            effect: [ability.effects.addKeyword('stealth'), ability.effects.addKeyword('renown')]
        });
    }
}

TheBloodroyal.code = '12030';

module.exports = TheBloodroyal;
