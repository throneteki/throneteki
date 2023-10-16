const DrawCard = require('../../drawcard.js');

class MartialLaw extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', limited: false });
        this.whileAttached({
            effect: ability.effects.cannotBeStood()
        });
    }
}

MartialLaw.code = '25510';
MartialLaw.version = '2.0';

module.exports = MartialLaw;
