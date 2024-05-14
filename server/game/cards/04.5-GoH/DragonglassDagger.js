const DrawCard = require('../../drawcard.js');

class DragonglassDagger extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });
        this.whileAttached({
            condition: () => this.parent.isParticipating(),
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.immuneTo(
                    (card) => card.controller !== this.controller && card.getType() === 'character'
                )
            ]
        });
    }
}

DragonglassDagger.code = '04086';

module.exports = DragonglassDagger;
