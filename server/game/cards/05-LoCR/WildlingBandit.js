const DrawCard = require('../../drawcard.js');

class WildlingBandit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.isAttacking(this) &&
                this.game.currentChallenge.defendingPlayer.gold > this.controller.gold),
            match: this,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

WildlingBandit.code = '05041';

module.exports = WildlingBandit;
