const DrawCard = require('../../../drawcard.js');

class TaenaMerryweather extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, player, card) => card.getType() === 'event' && card.controller === this.controller
            },
            cost: ability.costs.discardFromHand(),
            handler: context => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} and discards {2} from their hand to draw 1 card', 
                                      this.controller, this, context.discardCostCard);
            }
        });
    }
}

TaenaMerryweather.code = '05010';

module.exports = TaenaMerryweather;
