import DrawCard from '../../drawcard.js';

class EliaSand extends DrawCard {
    // Elia Sand (19007)
    // While Elia Sand is attacking, if you control another attacking Sand Snake character, raise
    // the claim value on your revealed plot card by 1.
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

export default EliaSand;
