const DrawCard = require('../../../drawcard.js');

class DaceyMormont extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getSTR())
        });
    }

    getSTR() {
        return this.controller.getNumberOfCardsInPlay(card => card.getType() === 'character' && card.isFaction('stark'));
    }
}

DaceyMormont.code = '06061';

module.exports = DaceyMormont;
