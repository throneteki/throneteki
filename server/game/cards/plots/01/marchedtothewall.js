const PlotCard = require('../../../plotcard.js');

class MarchedToTheWall extends PlotCard {
    revealed(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        player.drawCardsToHand(3);

        this.game.addMessage('{0} uses {1} to draw 3 cards to hand', player, this);

        return true;
    }
}

MarchedToTheWall.code = '01015';

module.exports = MarchedToTheWall;
