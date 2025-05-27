import DrawCard from '../../drawcard.js';

class HighgardenDestrier extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(
            (card) =>
                card.getType() === 'character' &&
                card.hasPrintedStrength() &&
                card.getPrintedStrength() <= 3 &&
                card.attachments.every(
                    (attachment) => attachment === this || attachment.name !== 'Highgarden Destrier'
                )
        );

        this.whileAttached({
            effect: ability.effects.dynamicStrength(() =>
                this.controller.getNumberOfCardsInPlay({ type: 'character', printedCostOrLower: 3 })
            )
        });
    }
}

HighgardenDestrier.code = '26016';

export default HighgardenDestrier;
