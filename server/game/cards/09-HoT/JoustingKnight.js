const DrawCard = require('../../drawcard.js');

class JoustingKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.game.isDuringChallenge({ attackingAlone: this }) &&
                !this.game.isDuringChallenge({ defendingAlone: this }),
            match: this,
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

JoustingKnight.code = '09016';

module.exports = JoustingKnight;
