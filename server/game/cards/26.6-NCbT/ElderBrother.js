import DrawCard from '../../drawcard.js';

class ElderBrother extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () =>
                this.controller.activePlot && this.controller.activePlot.hasTrait('The Seven'),
            effect: ability.effects.cannotBeKilled()
        });
    }
}

ElderBrother.code = '26117';

export default ElderBrother;
