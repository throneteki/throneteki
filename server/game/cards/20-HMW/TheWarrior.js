const PlotCard = require('../../plotcard.js');

class TheWarrior extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasAttackingSeven(),
            match: this,
            effect: ability.effects.modifyClaim(1)
        });
    }

    hasAttackingSeven() {
        return this.controller.anyCardsInPlay(
            (card) => card.isAttacking() && card.hasTrait('The Seven')
        );
    }
}

TheWarrior.code = '20060';

module.exports = TheWarrior;
