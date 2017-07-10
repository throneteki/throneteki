const DrawCard = require('../../../drawcard.js');

class CitaldelNovice extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: (e, player, card) => card === this
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                let topCard = this.controller.drawDeck.first();
                let message = '{0} uses {1} to reveal {2} as the top card of their deck';
                
                if(topCard.getType() === 'attachment' || (topCard.hasTrait('Maester') && 
                                                          topCard.getType() === 'character')) {
                    this.controller.drawCardsToHand(1);
                    message += ' and draw it';
                }

                this.game.addMessage(message, this.controller, this, topCard);
            }
        });
    }
}

CitaldelNovice.code = '09041';

module.exports = CitaldelNovice;
