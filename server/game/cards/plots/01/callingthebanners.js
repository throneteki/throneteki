const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class CallingTheBanners extends PlotCard {
    revealed(player) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        var otherPlayer = this.game.getOtherPlayer(player);

        if(!otherPlayer) {
            return;
        }

        var characterCount = _.reduce(otherPlayer.cardsInPlay, (memo, card) => {
            var count = memo;

            if(card.getType() === 'character') {
                count++;
            }

            return count;
        }, 0);

        if(characterCount <= 0) {
            return;
        }

        this.game.addMessage(player.name + ' uses ' + this.name + ' to gain ' + characterCount + ' gold');
        player.gold += characterCount;
    }
}

CallingTheBanners.code = '01007';

module.exports = CallingTheBanners;
