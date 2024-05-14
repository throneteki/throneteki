import DrawCard from '../../drawcard.js';

class DrownedMen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card === this,
            effect: ability.effects.dynamicStrength(() => this.calculateStrength())
        });
    }

    calculateStrength() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return card.getType() === 'location' && card.hasTrait('Warship');
        });

        return cards.length;
    }
}

DrownedMen.code = '01073';

export default DrownedMen;
