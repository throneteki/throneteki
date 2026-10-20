import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class YouWinOrYouDie extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 2
            }))
        });
    }
}

YouWinOrYouDie.code = '08120';

export default YouWinOrYouDie;
