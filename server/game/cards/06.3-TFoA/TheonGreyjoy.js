const DrawCard = require('../../drawcard.js');

class TheonGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ attackingAlone: this }),
            match: (card) =>
                card.getType() === 'character' && card.getStrength() > this.getStrength(),
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

TheonGreyjoy.code = '06051';

module.exports = TheonGreyjoy;
