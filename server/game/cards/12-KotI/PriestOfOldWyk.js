const DrawCard = require('../../drawcard.js');

class PriestOfOldWyk extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.deadPile.some((card) => card.hasTrait('Drowned God')),
            match: this,
            effect: ability.effects.contributesToDominanceWhileKneeling()
        });
    }
}

PriestOfOldWyk.code = '12012';

module.exports = PriestOfOldWyk;
