const DrawCard = require('../../../drawcard.js');

class SerLancelLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getOtherLannisterLords().length == 1,
            match: this,
            effect: ability.effects.dynamicStrenght(() => this.getOtherLannisterLords().first().getStrength())
        });
    }

    getOtherLannisterLords() {
        var cards = this.controller.cardsInPlay.filter(card => {
            return card.getFaction() === "lannister" && (card.hasTrait('Lord') || card.hasTrait('Lady')) && card.getType() === 'character' && card !== this;
        });

        return cards;
    }

}

SerLancelLannister.code = '05014';

module.exports = SerLancelLannister;

