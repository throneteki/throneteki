const DrawCard = require('../../drawcard.js');

class FrozenSolid extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(card => card.getType() === 'location' && !card.isLimited() && card.getCost() <= 3);
        this.whileAttached({
            effect: ability.effects.blank
        });
    }
}

FrozenSolid.code = '03021';

module.exports = FrozenSolid;
