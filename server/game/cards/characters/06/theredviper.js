const DrawCard = require('../../../drawcard.js');

class TheRedViper extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
            match: card => this.game.currentChallenge.isDefending(card) && card.getType() === 'character' && card.getNumberOfIcons() < 2,
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

TheRedViper.code = '06095';

module.exports = TheRedViper;
