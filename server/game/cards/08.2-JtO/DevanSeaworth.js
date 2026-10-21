import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DevanSeaworth extends DrawCard {
    // Devan Seaworth (08027)
    // Bestow (3).
    // Reaction: After you win dominance, discard X gold from Devan Seaworth to search your deck for
    // a non-limited location with printed cost X or lower, reveal it, and put it into play (X
    // cannot be 0). Shuffle your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event) => event.winner === this.controller
            },
            cost: ability.costs.discardXGold(
                () => 1,
                () => 99
            ),
            message: {
                format: '{player} discards {discardedGold} gold from {source} to search their deck for a non-limited location',
                args: { discardedGold: (context) => context.xValue }
            },
            gameAction: GameActions.search({
                title: 'Select a location',
                match: {
                    type: 'location',
                    limited: false,
                    condition: (card, context) => card.getPrintedCost() <= context.xValue
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

DevanSeaworth.code = '08027';

export default DevanSeaworth;
