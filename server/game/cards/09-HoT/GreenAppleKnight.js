const DrawCard = require('../../drawcard.js');

class GreenAppleKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getNumberOfOtherKnights())
        });
        this.persistentEffect({
            condition: () => this.getNumberOfOtherKnights() >= 2,
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    getNumberOfOtherKnights() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card !== this && card.getType() === 'character' && card.hasTrait('Knight')
        );
    }
}

GreenAppleKnight.code = '09012';

module.exports = GreenAppleKnight;
