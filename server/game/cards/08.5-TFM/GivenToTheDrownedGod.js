import DrawCard from '../../drawcard.js';

class GivenToTheDrownedGod extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            cost: ability.costs.kill((card) => card.hasTrait('Drowned God')),
            handler: (context) => {
                let cards = context.costs.kill.getPrintedCost();
                this.controller.drawCardsToHand(cards);
                this.game.addMessage(
                    '{0} uses {1} to draw {2} cards',
                    this.controller,
                    this,
                    cards
                );
            }
        });
    }
}

GivenToTheDrownedGod.code = '08092';

export default GivenToTheDrownedGod;
