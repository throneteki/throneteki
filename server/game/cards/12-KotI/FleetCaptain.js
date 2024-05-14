const DrawCard = require('../../drawcard.js');

class FleetCaptain extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.dynamicStrength(() => this.calculateStrength()),
                ability.effects.addTrait('captain')
            ]
        });
    }

    calculateStrength() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return card.getType() === 'location' && card.hasTrait('Warship');
        });

        return cards.length < 3 ? 1 : 3;
    }
}

FleetCaptain.code = '12022';

module.exports = FleetCaptain;
