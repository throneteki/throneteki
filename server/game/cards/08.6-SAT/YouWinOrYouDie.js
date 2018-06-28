const PlotCard = require('../../plotcard.js');
const TextHelper = require('../../TextHelper');

class YouWinOrYouDie extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage('{0} uses {1} to draw {2} to hand',
                    this.controller, this, TextHelper.count(cards, 'card'));
            }
        });
    }
}

YouWinOrYouDie.code = '08120';

module.exports = YouWinOrYouDie;
