const DrawCard = require('../../drawcard.js');

class NightfortBuilder extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: event => event.card === this
            },
            handler: () => {
                let topCard = this.controller.drawDeck[0];
                let message = '{0} uses {1} to reveal {2} as the top card of their deck';

                if(this.controller.canDraw() && 
                   ((topCard.isFaction('thenightswatch') && topCard.getType() === 'attachment') ||
                    (topCard.isFaction('thenightswatch') && topCard.getType() === 'location'))) {
                    this.controller.drawCardsToHand(1);
                    message += ' and draw it';
                }

                this.game.addMessage(message, this.controller, this, topCard);
            }
        });
    }
}

NightfortBuilder.code = '11105';

module.exports = NightfortBuilder;
