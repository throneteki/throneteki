const DrawCard = require('../../drawcard.js');

class AegonTheConqueror extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', unique: true });
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay({ type: 'character', attacking: true, trait: 'Dragon', printedCostOrHigher: 7 }),
            match: card => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

AegonTheConqueror.code = '25581';
AegonTheConqueror.version = '1.0';

module.exports = AegonTheConqueror;
