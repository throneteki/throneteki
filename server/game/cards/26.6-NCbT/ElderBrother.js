import DrawCard from '../../drawcard.js';

class ElderBrother extends DrawCard {
    // Elder Brother (26117)
    // While you have a The Seven plot card revealed, Elder Brother cannot be killed.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: (context) =>
                context.source.controller.activePlot &&
                context.source.controller.activePlot.hasTrait('The Seven'),
            effect: ability.effects.cannotBeKilled()
        });
    }
}

ElderBrother.code = '26117';

export default ElderBrother;
