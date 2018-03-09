const DrawCard = require('../../drawcard.js');

class SixMaidsInAPool extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw cards',
            condition: () => this.controller.canDraw(),
            handler: () => {
                var cards = this.controller.getNumberOfCardsInPlay(card => card.hasTrait('Lady') && card.getType() === 'character');
                cards = this.controller.drawCardsToHand(cards).length;
                this.game.addMessage('{0} plays {1} to draw {2} {3}', this.controller, this, cards, cards > 1 ? 'cards' : 'card');
            }
        });
    }
}

SixMaidsInAPool.code = '09023';

module.exports = SixMaidsInAPool;
