import PlotCard from '../../plotcard.js';

class CityFestival extends PlotCard {
    // City Festival (19020)
    // When Revealed: Gain 3 gold. (6 gold instead if there are 2 or more City plot cards in your
    // used pile.)
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                if (context.player.canGainGold()) {
                    let numGold = context.player.getNumberOfUsedPlotsByTrait('City') >= 2 ? 6 : 3;
                    let gold = this.game.addGold(context.player, numGold);
                    this.game.addMessage(
                        '{0} uses {1} to gain {2} gold',
                        context.player,
                        this,
                        gold
                    );
                }
            }
        });
    }
}

CityFestival.code = '19020';

export default CityFestival;
