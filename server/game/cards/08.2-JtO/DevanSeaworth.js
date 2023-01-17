const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class DevanSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: event => event.winner === this.controller
            },
            cost: ability.costs.discardXGold(() => 1, () => 99),
            message: {
                format: '{player} discards {discardedGold} gold from {source} to search their deck for a non-limited location',
                args: { discardedGold: context => context.xValue }
            },
            gameAction: GameActions.search({
                title: 'Select a location',
                match: { type: 'location', limited: false, condition: (card, context) => card.getPrintedCost() <= context.xValue },
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

DevanSeaworth.code = '08027';

module.exports = DevanSeaworth;
