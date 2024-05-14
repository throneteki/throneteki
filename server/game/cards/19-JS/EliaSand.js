const DrawCard = require('../../drawcard.js');

class EliaSand extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking() && this.anotherSandSnakeIsAttacking(),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    anotherSandSnakeIsAttacking() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() &&
                card.hasTrait('Sand Snake') &&
                card.getType() === 'character' &&
                card !== this
        );
    }
}

EliaSand.code = '19007';

module.exports = EliaSand;
