const PlotCard = require('../../plotcard.js');

class CityFestival extends PlotCard {
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

module.exports = CityFestival;
