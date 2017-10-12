const DrawCard = require('../../drawcard.js');

class SixMaidsInAPool extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw cards',
            handler: () => {
                let cards = this.controller.getNumberOfCardsInPlay(card => card.hasTrait('Lady') && card.getType() === 'character');
                this.controller.drawCardsToHand(cards);
                this.game.addMessage('{0} plays {1} to draw {2} cards', this.controller, this, cards);
            }
        });
    }
}

SixMaidsInAPool.code = '09023';

module.exports = SixMaidsInAPool;
