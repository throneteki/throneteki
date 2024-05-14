const PlotCard = require('../../plotcard');
const TextHelper = require('../../TextHelper');

class YouWinOrYouDie extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                let cards = context.player.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

YouWinOrYouDie.code = '08120';

module.exports = YouWinOrYouDie;
