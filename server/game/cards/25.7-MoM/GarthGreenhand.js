const DrawCard = require('../../drawcard.js');

class GarthGreenhand extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', faction: 'tyrell', controller: 'current', unique: true });
        this.plotModifiers({
            gold: 1
        });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge(),
            match: card => card.controller === this.controller && card.isParticipating() && card.isFaction('tyrell') && card.isUnique(),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

GarthGreenhand.code = '25593';
GarthGreenhand.version = '1.1';

module.exports = GarthGreenhand;
