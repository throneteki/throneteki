const DrawCard = require('../../drawcard.js');

class DaenerysFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.isParticipating(this.parent)
            ),
            match: card => this.game.currentChallenge.isParticipating(card) && card.getType() === 'character' && card !== this.parent,
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

DaenerysFavor.code = '05036';

module.exports = DaenerysFavor;
