import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AlchemistApprentice extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to return location',
            cost: ability.costs.kneelSelf(),
            phase: 'dominance',
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: {
                    location: 'play area',
                    type: 'location',
                    limited: false,
                    printedCostOrLower: 2
                }
            },
            message: "{player} kneels {costs.kneel} to return {target} to its owner's hand",
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

AlchemistApprentice.code = '26105';

export default AlchemistApprentice;
