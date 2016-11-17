const PlotCard = require('../../../plotcard.js');

class AStormOfSwords extends PlotCard {
    revealed(player) {
        if(this.owner !== player) {
            return true;
        }

        player.addChallenge('military', 1);

        this.game.addMessage('{0} uses {1} to gain an additional military challenge this round', player, this);
    }
}

AStormOfSwords.code = '01005';

module.exports = AStormOfSwords;
