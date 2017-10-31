const DrawCard = require('../../drawcard.js');

class BalonGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
            match: card => (
                this.game.currentChallenge.isDefending(card) &&
                card.getType() === 'character' &&
                card.getStrength() < this.getStrength()
            ),
            targetController: 'opponent',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

BalonGreyjoy.code = '01068';

module.exports = BalonGreyjoy;
