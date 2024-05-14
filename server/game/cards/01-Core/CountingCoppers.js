const PlotCard = require('../../plotcard.js');
const TextHelper = require('../../TextHelper');

class CountingCoppers extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                let cards = context.player.drawCardsToHand(3).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2} to hand',
                    context.player,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

CountingCoppers.code = '01010';

module.exports = CountingCoppers;
