import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BenjensCache extends PlotCard {
    // Benjen's Cache (16031)
    // When Revealed: If there are no Kingdom plot cards in your used pile, search your deck for a
    // card and add it to your hand. Shuffle your deck.
    setupCardAbilities() {
        this.whenRevealed({
            condition: (context) => context.player.getNumberOfUsedPlotsByTrait('kingdom') === 0,
            gameAction: GameActions.search({
                title: 'Select a card',
                message: '{player} uses {source} to search their deck and add a card to their hand',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BenjensCache.code = '16031';

export default BenjensCache;
