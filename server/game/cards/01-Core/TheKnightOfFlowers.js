const DrawCard = require('../../drawcard.js');

class TheKnightOfFlowers extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ attackingAlone: this }),
            targetController: 'opponent',
            effect: ability.effects.setDefenderMaximum(1)
        });
    }
}

TheKnightOfFlowers.code = '01185';

module.exports = TheKnightOfFlowers;
