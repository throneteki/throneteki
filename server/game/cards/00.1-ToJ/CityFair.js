import PlotCard from '../../plotcard.js';
import TextHelper from '../../TextHelper.js';

class CityFair extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                let cards = this.hasUsedCityPlot(context.player) ? 2 : 1;
                cards = context.player.drawCardsToHand(cards).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }

    hasUsedCityPlot(player) {
        return player.getNumberOfUsedPlotsByTrait('City') > 0;
    }
}

CityFair.code = '00374';

export default CityFair;
