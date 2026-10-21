import DrawCard from '../../drawcard.js';

class Dawn extends DrawCard {
    // Dawn (01115)
    // Attached character gets +1 STR for each plot card in your used pile.
    // While attached character has the House Dayne trait, it gains intimidate.
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
