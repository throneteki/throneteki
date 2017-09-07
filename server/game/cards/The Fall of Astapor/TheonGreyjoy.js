const DrawCard = require('../../../drawcard.js');

class TheonGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge && 
                this.game.currentChallenge.isAttacking(this) && 
                this.game.currentChallenge.attackers.length === 1),
            match: card => card.getType() === 'character' && card.getStrength() > this.getStrength(),
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

TheonGreyjoy.code = '06051';

module.exports = TheonGreyjoy;
