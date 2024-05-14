import DrawCard from '../../drawcard.js';

class DothrakiSteed extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(
            (card) =>
                card.getType() === 'character' &&
                card.attachments.every(
                    (attachment) => attachment === this || attachment.name !== 'Dothraki Steed'
                )
        );

        this.whileAttached({
            condition: () => this.parent.isAttacking(),
            effect: ability.effects.dynamicStrength(() => this.getSTR())
        });
    }

    getSTR() {
        return this.parent.hasTrait('Dothraki') ? 3 : 1;
    }
}

DothrakiSteed.code = '14036';

export default DothrakiSteed;
