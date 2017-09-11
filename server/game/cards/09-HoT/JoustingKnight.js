const DrawCard = require('../../drawcard.js');

class JoustingKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isParticipating(this) &&
                             !this.game.currentChallenge.hasSingleParticipant(this.controller),
            match: this,
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

JoustingKnight.code = '09016';

module.exports = JoustingKnight;
