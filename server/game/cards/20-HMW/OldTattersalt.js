import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldTattersalt extends DrawCard {
    // Old Tattersalt (20021)
    // Shadow (2).
    // Reaction: After Old Tattersalt enters play, search the top X cards of your deck for a card
    // with printed cost 1 or lower, reveal it, and add it to your hand. Shuffle your deck. X is
    // your reserve value.
    // Action: Kneel Blackbird to return Old Tattersalt to shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Return to shadows',
            cost: ability.costs.kneel((card) => card.name === 'Blackbird'),
            message: '{player} kneels {costs.kneel} to return {source} to shadows',
            gameAction: GameActions.putIntoShadows({ card: this })
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message: {
                format: '{player} uses {source} to search the top {reserve} cards of their deck for a card with printed cost 1 or lower',
                args: { reserve: (context) => context.player.getReserve() }
            },
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: (context) => context.player.getReserve(),
                match: { printedCostOrLower: 1 },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

OldTattersalt.code = '20021';

export default OldTattersalt;
