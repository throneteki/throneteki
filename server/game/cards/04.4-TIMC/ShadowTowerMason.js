const DrawCard = require('../../drawcard.js');

class ShadowTowerMason extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getCardCount() >= 3,
            match: this,
            effect: [ability.effects.addIcon('military'), ability.effects.addIcon('intrigue')]
        });
    }

    getCardCount() {
        return this.controller.getNumberOfCardsInPlay(
            (card) =>
                ['attachment', 'location'].includes(card.getType()) &&
                card.isFaction('thenightswatch')
        );
    }
}

ShadowTowerMason.code = '04065';

module.exports = ShadowTowerMason;
