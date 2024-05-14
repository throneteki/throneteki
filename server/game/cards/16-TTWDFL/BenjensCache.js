import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BenjensCache extends PlotCard {
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
