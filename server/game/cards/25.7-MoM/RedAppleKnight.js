const DrawCard = require('../../drawcard.js');

class RedAppleKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getSingleKnight(),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getSingleKnight().getStrength())
        });
    }

    getSingleKnight() {
        let cards = this.controller.filterCardsInPlay(card => card.isFaction('tyrell') && card.hasTrait('knight') && card.getType() === 'character' && card.isUnique());

        if(cards.length === 1) {
            return cards[0];
        }

        return;
    }
}

RedAppleKnight.code = '25590';
RedAppleKnight.version = '1.0';

module.exports = RedAppleKnight;
