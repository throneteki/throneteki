import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BreakingTies extends PlotCard {
    // Breaking Ties (10050)
    // Action: Sacrifice a loyal character to choose a non-loyal character or location and return it
    // to its owner's hand. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Return character/location to hand',
            limit: ability.limit.perRound(2),
            cost: ability.costs.sacrifice(
                (card) => card.isLoyal() && card.getType() === 'character'
            ),
            target: {
                activePromptTitle: 'Select character or location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    !card.isLoyal() &&
                    ['character', 'location'].includes(card.getType()),
                gameAction: 'returnToHand'
            },
            message: {
                format: "{player} uses {source} and sacrifices {costs.sacrifice} to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

BreakingTies.code = '10050';

export default BreakingTies;
