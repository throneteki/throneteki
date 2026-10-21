import DrawCard from '../../drawcard.js';

class FleetCaptain extends DrawCard {
    // Fleet Captain (12022)
    // Attached character gains the Captain trait and gets +1 STR. (+3 STR instead if you control 3
    // or more Warship locations.)
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

export default FleetCaptain;
