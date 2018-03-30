const PlotCard = require('../../plotcard.js');

class YouWinOrYouDie extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage('{0} uses {1} to draw {2} {3} to hand',
                    this.controller, this, cards, cards > 1 ? 'cards' : 'card');
            }
        });
    }
}

YouWinOrYouDie.code = '08120';

module.exports = YouWinOrYouDie;
