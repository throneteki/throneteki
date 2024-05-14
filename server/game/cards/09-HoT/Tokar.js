const DrawCard = require('../../drawcard.js');

class Tokar extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });

        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.parent.attachments.length)
        });

        this.persistentEffect({
            condition: () => this.parent && this.parent.isParticipating(),
            match: (card) => card.getType() === 'character' && card.attachments.length === 0,
            targetController: 'any',
            effect: ability.effects.cannotGainPower()
        });
    }
}

Tokar.code = '09038';

module.exports = Tokar;
