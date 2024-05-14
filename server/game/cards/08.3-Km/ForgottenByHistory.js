const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class ForgottenByHistory extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Shuffle character into deck',
            phase: 'dominance',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= card.controller.faction.power &&
                    GameActions.shuffleIntoDeck({ cards: [card] }).allow()
            },
            message: {
                format: "{player} plays {source} to shuffle {target} into {owner}'s deck",
                args: { owner: (context) => context.target.owner }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.shuffleIntoDeck((context) => ({ cards: [context.target] })),
                    context
                );
            }
        });
    }
}

ForgottenByHistory.code = '08059';

module.exports = ForgottenByHistory;
