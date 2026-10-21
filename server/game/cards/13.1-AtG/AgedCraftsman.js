import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AgedCraftsman extends DrawCard {
    // Aged Craftsman (13005)
    // No attachments.
    // Reaction: After Aged Craftsman enters play, search the top 10 cards of your deck for a
    // [thenightswatch] location with printed cost 2 or lower and put it into play. Shuffle your
    // deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a location',
            gameAction: GameActions.search({
                title: 'Select a location',
                topCards: 10,
                match: { type: 'location', printedCostOrLower: 2, faction: 'thenightswatch' },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

AgedCraftsman.code = '13005';

export default AgedCraftsman;
