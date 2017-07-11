const DrawCard = require('../../../drawcard.js');

class JonSnow extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled && this.game.currentChallenge && this.hasOtherAttackingNightsWatch(),
            match: this,
            effect: ability.effects.consideredToBeAttacking()
        });
    }

    hasOtherAttackingNightsWatch() {
        return this.controller.anyCardsInPlay(card => this.game.currentChallenge.isAttacking(card) &&
                                                      card.isFaction('thenightswatch') &&
                                                      card.getType() === 'character' &&
                                                      card !== this);
    }
}

JonSnow.code = '01124';

module.exports = JonSnow;
