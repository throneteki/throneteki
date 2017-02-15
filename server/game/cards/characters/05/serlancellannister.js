const DrawCard = require('../../../drawcard.js');

class SerLancelLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getSingleOtherLannisterLordOrLady(),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getSingleOtherLannisterLordOrLady().getStrength())
        });
    }

    getSingleOtherLannisterLordOrLady() {
        var cards = this.controller.cardsInPlay.filter(card => {
            return card.getFaction() === "lannister" && (card.hasTrait('Lord') || card.hasTrait('Lady')) && card.getType() === 'character' && card !== this;
        });

        if (cards.length === 1) {
            return cards.first();
        }

        return;
    }

}

SerLancelLannister.code = '05014';

module.exports = SerLancelLannister;

