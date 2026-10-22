import DrawCard from '../../drawcard.js';

function anotherSandSnakeIsAttacking(source) {
    return source.controller.anyCardsInPlay(
        (card) =>
            card.isAttacking() &&
            card.hasTrait('Sand Snake') &&
            card.getType() === 'character' &&
            card !== source
    );
}

class EliaSand extends DrawCard {
    // Elia Sand (19007)
    // While Elia Sand is attacking, if you control another attacking Sand Snake character, raise
    // the claim value on your revealed plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.isAttacking() && anotherSandSnakeIsAttacking(context.source),
            match: (card, context) => card === context.source.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

EliaSand.code = '19007';

export default EliaSand;
