import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Cragorn extends DrawCard {
    // Cragorn (18004)
    // Bestow (3).
    // Challenges Action: Discard 1 gold from a Raider character to search the top 10 cards of your
    // deck for an Item or Weapon attachment with printed cost 3 or lower and put it into play.
    // Shuffle your deck. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 10 cards',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGoldFromCard(
                1,
                (card, context) =>
                    card.getType() === 'character' &&
                    card.hasTrait('Raider') &&
                    card.controller === context.player
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

export default Cragorn;
