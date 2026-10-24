import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class CityFestival extends PlotCard {
    // City Festival (19020)
    // When Revealed: Gain 3 gold. (6 gold instead if there are 2 or more City plot cards in your
    // used pile.)
    setupCardAbilities() {
        this.whenRevealed({
            message: {
                format: '{player} uses {source} to gain {amount} gold',
                args: { amount: (context) => festivalGold(context.player) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: festivalGold(context.player)
            }))
        });
    }
}

function festivalGold(player) {
    return player.getNumberOfUsedPlotsByTrait('City') >= 2 ? 6 : 3;
}

CityFestival.code = '19020';

export default CityFestival;
