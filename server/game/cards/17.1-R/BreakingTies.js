import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BreakingTies extends PlotCard {
    // Breaking Ties (17153)
    // Action: Shuffle a standing loyal character into your deck to choose a non-loyal character or
    // location and return it to its owner's hand. (Limit X times per round, where X is the number
    // of opponents you have.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Return character/location to hand',
            limit: ability.limit.perRound(
                (context) => context.game.getOpponents(context.player).length
            ),
            cost: ability.costs.shuffleCardIntoDeck(
                (card) => card.isLoyal() && card.getType() === 'character' && !card.kneeled
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
                format: "{player} uses {source} and shuffles {costs.shuffleCardIntoDeckCost} into their deck to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

BreakingTies.code = '17153';

export default BreakingTies;
