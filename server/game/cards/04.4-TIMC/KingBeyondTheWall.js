const DrawCard = require('../../drawcard.js');

class KingBeyondTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });

        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this.parent) && this.hasLessTotalPower(this.game.currentChallenge.defendingPlayer),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('Wildling')) {
            return false;
        }

        return super.canAttach(player, card);
    }

    hasLessTotalPower(opponent) {
        return this.controller.getTotalPower() < opponent.getTotalPower();
    }
}

KingBeyondTheWall.code = '04079';

module.exports = KingBeyondTheWall;
