const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Cragorn extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 10 cards',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGoldFromCard(
                1,
                (card) =>
                    card.getType() === 'character' &&
                    card.hasTrait('Raider') &&
                    card.controller === this.controller
            ),
            message:
                '{player} discards 1 gold from {costs.discardToken} to search the top 10 cards of their deck for an Item or Weapon attachment',
            gameAction: GameActions.search({
                title: 'Select an attachment',
                topCards: 10,
                match: { type: 'attachment', printedCostOrLower: 3, trait: ['Item', 'Weapon'] },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Cragorn.code = '18004';

module.exports = Cragorn;
