const PlotCard = require('../../plotcard.js');

class BreakingTies extends PlotCard {
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
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} uses {1} and sacrifices {2} to return {3} to {4}'s hand",
                    context.player,
                    this,
                    context.costs.sacrifice,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

BreakingTies.code = '10050';

module.exports = BreakingTies;
