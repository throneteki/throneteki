import DrawCard from '../../drawcard.js';

class RedAppleKnight extends DrawCard {
    // Red-Apple Knight (25015)
    // While you control exactly 1 unique [tyrell] Knight character, Red-Apple Knight gets +X STR. X
    // is that character's STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getSingleKnight(),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getSingleKnight().getStrength())
        });
    }

    getSingleKnight() {
        let cards = this.controller.filterCardsInPlay(
            (card) =>
                card.isFaction('tyrell') &&
                card.hasTrait('knight') &&
                card.getType() === 'character' &&
                card.isUnique()
        );

        if (cards.length === 1) {
            return cards[0];
        }

        return;
    }
}

RedAppleKnight.code = '25015';

export default RedAppleKnight;
