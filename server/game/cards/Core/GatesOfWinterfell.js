const DrawCard = require('../../drawcard.js');

class GatesOfWinterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top card of deck',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let topCard = this.controller.drawDeck.first();
                let message = '{0} kneels {1} to reveal {2} as the top card of their deck';

                if(topCard.isFaction('stark')) {
                    this.controller.drawCardsToHand(1);
                    message += ' and draw it';
                }

                this.game.addMessage(message, this.controller, this, topCard);
            }
        });
    }
}

GatesOfWinterfell.code = '01154';

module.exports = GatesOfWinterfell;
