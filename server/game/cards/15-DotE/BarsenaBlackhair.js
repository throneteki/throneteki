import DrawCard from '../../drawcard.js';

class BarsenaBlackhair extends DrawCard {
    // Barsena Blackhair (15011)
    // No attachments except Weapon.
    // While there is a Weapon attachment attached to Barsena Blackhair, she gets +3 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) =>
                        card.parent === this &&
                        card.getType() === 'attachment' &&
                        card.hasTrait('Weapon')
                ),
            match: this,
            effect: ability.effects.modifyStrength(3)
        });
    }
}

BarsenaBlackhair.code = '15011';

export default BarsenaBlackhair;
