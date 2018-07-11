const DrawCard = require('../../drawcard.js');

class RedRonnet extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this) &&
                             this.game.currentChallenge.defendingPlayer.shadows.length > 0,
            match: card => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

RedRonnet.code = '11107';

module.exports = RedRonnet;
