const PlotCard = require('../../plotcard.js');

class GrandMelee extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => this.game.isDuringChallenge({ attackingAlone: card }) || this.game.isDuringChallenge({ defendingAlone: card }),
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

GrandMelee.code = '10051';

module.exports = GrandMelee;
