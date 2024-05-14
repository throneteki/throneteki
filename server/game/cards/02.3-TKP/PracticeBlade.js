const DrawCard = require('../../drawcard.js');

class PracticeBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });
        this.whileAttached({
            effect: [ability.effects.modifyStrength(1), ability.effects.addIcon('military')]
        });
    }
}

PracticeBlade.code = '02046';

module.exports = PracticeBlade;
