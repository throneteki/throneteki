const DrawCard = require('../../drawcard.js');

class TommenBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (player) => player.hand.length === 0,
            effect: ability.effects.cannotGainChallengeBonus()
        });
    }
}

TommenBaratheon.code = '05015';

module.exports = TommenBaratheon;
