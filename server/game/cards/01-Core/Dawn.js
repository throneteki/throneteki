import DrawCard from '../../drawcard.js';

class Dawn extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.controller.getNumberOfUsedPlots())
        });
        this.whileAttached({
            match: (card) => card.hasTrait('House Dayne'),
            effect: ability.effects.addKeyword('Intimidate')
        });
    }
}

Dawn.code = '01115';

export default Dawn;
