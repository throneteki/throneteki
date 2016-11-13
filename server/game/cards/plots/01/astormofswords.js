const PlotCard = require('../../../plotcard.js');

class AStormOfSwords extends PlotCard {
    revealed(player) {
        if(this.owner !== player) {
            return;
        }

        player.addChallenge('military', 1);

        this.game.addMessage(player.name + ' uses ' + this.name + ' to gain an additional military challenge this round');
    }
}

AStormOfSwords.code = '01005';

module.exports = AStormOfSwords;
