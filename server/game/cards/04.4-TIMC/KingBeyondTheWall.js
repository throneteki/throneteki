const DrawCard = require('../../drawcard.js');

class KingBeyondTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Wildling' });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });

        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.isAttacking(this.parent) &&
                this.hasLessTotalPower(this.game.currentChallenge.defendingPlayer),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    hasLessTotalPower(opponent) {
        return this.controller.getTotalPower() < opponent.getTotalPower();
    }
}

KingBeyondTheWall.code = '04079';

module.exports = KingBeyondTheWall;
