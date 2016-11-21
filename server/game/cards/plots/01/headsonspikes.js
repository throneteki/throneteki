const PlotCard = require('../../../plotcard.js');

class HeadsOnSpikes extends PlotCard {
    revealed(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var otherPlayer = this.game.getOtherPlayer(player);

        if(!otherPlayer) {
            return true;
        }

        if(otherPlayer.hand.size() === 0) {
            return true;
        }

        var cardIndex = _.random(0, otherPlayer.hand.size() - 1);
        var card = otherPlayer.hand[cardIndex];
        var powerMessage = '';

        otherPlayer.removeFromHand(card);

        if(card.getType() === 'character') {
            powerMessage = ' and gain 2 power for their faction';
            otherPlayer.deadPile.push(card);
            
            this.game.addPower(player, 2);
        } else {
            otherPlayer.discardPile.push(card);
        }

        this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand{4}', player, this, card, otherPlayer, powerMessage);

        return true;        
    }
}

HeadsOnSpikes.code = '01013';

module.exports = HeadsOnSpikes;
