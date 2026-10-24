import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class CountingCoppers extends PlotCard {
    // Counting Coppers (01010)
    // When Revealed: Draw 3 cards.
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to draw 3 cards to hand',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 3 }))
        });
    }
}

CountingCoppers.code = '01010';

export default CountingCoppers;
