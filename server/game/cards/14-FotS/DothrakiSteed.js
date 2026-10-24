import DrawCard from '../../drawcard.js';

class DothrakiSteed extends DrawCard {
    // Dothraki Steed (14036)
    // Limit 1 copy per character.
    // While attached character is attacking, it gets +1 STR (+3 STR instead if it has the Dothraki
    // trait).
    setupCardAbilities(ability) {
        this.attachmentRestriction(
            (card, context) =>
                card.getType() === 'character' &&
                card.attachments.every(
                    (attachment) =>
                        attachment === context.source || attachment.name !== 'Dothraki Steed'
                )
        );
        this.whileAttached({
            condition: (context) => context.source.parent.isAttacking(),
            effect: ability.effects.dynamicStrength((card) => (card.hasTrait('Dothraki') ? 3 : 1))
        });
    }
}

DothrakiSteed.code = '14036';

export default DothrakiSteed;
