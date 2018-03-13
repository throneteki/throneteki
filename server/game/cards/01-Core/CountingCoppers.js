const PlotCard = require('../../plotcard.js');

class CountingCoppers extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let cards = this.controller.drawCardsToHand(3).length;
                this.game.addMessage('{0} uses {1} to draw {2} {3} to hand',
                    this.controller, this, cards, cards > 1 ? 'cards' : 'card');
            }
        });
    }
}

CountingCoppers.code = '01010';

module.exports = CountingCoppers;
