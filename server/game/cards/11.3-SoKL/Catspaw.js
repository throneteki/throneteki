import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function getMinimumCost(source) {
    return source.game
        .filterCardsInPlay((card) => card !== source && card.getType() === 'character')
        .map((card) => card.getPrintedCost())
        .reduce((acc, val) => Math.min(acc, val), 0);
}

class Catspaw extends DrawCard {
    // Catspaw (11049)
    // Shadow (2).
    // Reaction: After Catspaw comes out of shadows, pay X gold to choose another character with
    // printed cost X or lower and return it to its owner's hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            cost: ability.costs.payXGold(
                (context) => getMinimumCost(context.source),
                () => 99
            ),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (context.xValue
                        ? card.getPrintedCost() <= context.xValue
                        : card.getPrintedCost() <= context.source.controller.getSpendableGold())
            },
            message: {
                format: "{player} uses {source} and pays {costs.gold} gold to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

Catspaw.code = '11049';

export default Catspaw;
