import DrawCard from '../../drawcard.js';

class HighgardenDestrier extends DrawCard {
    // Highgarden Destrier (26016)
    // Limit 1 copy per character. Character with printed STR 3 or lower only.
    // Attached character gets +1 STR for each character you control with printed cost 3 or lower.
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
