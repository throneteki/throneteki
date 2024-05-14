const DrawCard = require('../../drawcard.js');

class WildlingBandit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.isAttacking() &&
                this.game.isDuringChallenge({
                    match: (challenge) => challenge.defendingPlayer.gold > this.controller.gold
                }),
            match: this,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

WildlingBandit.code = '05041';

module.exports = WildlingBandit;
