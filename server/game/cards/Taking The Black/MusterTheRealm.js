const PlotCard = require('../../plotcard.js');

class MusterTheRealm extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.hasAttackingArmy(),
            match: this,
            effect: ability.effects.modifyClaim(1)
        });
    }

    hasAttackingArmy() {
        return this.controller.anyCardsInPlay(card => this.game.currentChallenge.isAttacking(card) && card.hasTrait('Army'));
    }
}

MusterTheRealm.code = '02019';

module.exports = MusterTheRealm;
