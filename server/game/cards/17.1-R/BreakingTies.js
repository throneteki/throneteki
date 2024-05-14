const PlotCard = require('../../plotcard.js');

class BreakingTies extends PlotCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return character/location to hand',
            limit: ability.limit.perRound(1), //TODO make it limit X when meelee gets implemented
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
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} uses {1} and shuffles {2} into their deck to return {3} to {4}'s hand",
                    context.player,
                    this,
                    context.costs.shuffleCardIntoDeckCost,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

BreakingTies.code = '17153';

module.exports = BreakingTies;
