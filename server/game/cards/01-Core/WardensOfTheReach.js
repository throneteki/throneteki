import DrawCard from '../../drawcard.js';

class WardensOfTheReach extends DrawCard {
    // Wardens of the Reach (01190)
    // No attachments.
    // Wardens of the Reach gets +1 STR for each The Reach location you control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicStrength((card, context) =>
                context.source.calculateStrength()
            )
        });
    }

    calculateStrength() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'location' && card.hasTrait('The Reach')
        );
    }
}

WardensOfTheReach.code = '01190';

export default WardensOfTheReach;
