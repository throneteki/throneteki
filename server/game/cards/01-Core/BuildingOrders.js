import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BuildingOrders extends PlotCard {
    // Building Orders (01006)
    // When Revealed: Search the top 10 cards of your deck for an attachment or a location, reveal
    // it, and add it to your hand. Shuffle your deck.
    setupCardAbilities() {
        this.whenRevealed({
            message:
                '{player} uses {source} to search the top 10 cards of their deck for an attachment or location',
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: 10,
                match: { type: ['attachment', 'location'] },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BuildingOrders.code = '01006';

export default BuildingOrders;
