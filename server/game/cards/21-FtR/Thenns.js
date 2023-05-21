const DrawCard = require('../../drawcard.js');

class Thenns extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.anyNonArmyOrWildlingInPlay() && this.game.isDuringChallenge(),
            match: this,
            effect: ability.effects.cannotTargetUsingAssault()
        });
    }
  
    anyNonArmyOrWildlingInPlay() {
        return this.game.anyCardsInPlay(card => card.isAttacking() && !card.hasTrait('Army') && !card.hasTrait('Wildling'));
    }
}

Thenns.code = '21026';

module.exports = Thenns;
