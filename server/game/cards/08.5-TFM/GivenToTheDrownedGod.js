import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class GivenToTheDrownedGod extends DrawCard {
    // Given to the Drowned God (08092)
    // Action: Kill a Drowned God character to draw X cards. X is that character's printed cost.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            cost: ability.costs.kill((card) => card.hasTrait('Drowned God')),
            message: {
                format: '{player} uses {source} to draw {cards} cards',
                args: {
                    cards: (context) =>
                        context.costs.kill.translateXValue(context.costs.kill.getPrintedCost())
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.costs.kill.translateXValue(context.costs.kill.getPrintedCost())
            }))
        });
    }
}

GivenToTheDrownedGod.code = '08092';

export default GivenToTheDrownedGod;
