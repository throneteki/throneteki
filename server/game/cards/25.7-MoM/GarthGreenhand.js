const DrawCard = require('../../drawcard.js');

class GarthGreenhand extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', unique: true });
        this.plotModifiers({
            gold: 1
        });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge(),
            match: card => card.controller === this.controller && card.isParticipating() && card.isFaction('tyrell'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

GarthGreenhand.code = '25593';
GarthGreenhand.version = '1.0';

module.exports = GarthGreenhand;
