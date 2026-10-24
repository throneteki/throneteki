import DrawCard from '../../drawcard.js';

class DrownedMen extends DrawCard {
    // Drowned Men (01073)
    // No attachments.
    // Drowned Men gets +1 STR for each Warship location you control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicStrength((card, context) =>
                context.source.calculateStrength()
            )
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
