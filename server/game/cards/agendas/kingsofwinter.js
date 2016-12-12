const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');

class KingsOfWinter extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotFlip']);
    }

    onPlotFlip() {
        _.each(this.game.getPlayers(), player => {
            if(player.activePlot) {
                player.activePlot.reserveModifier++;
            }

            player.selectedPlot.reserveModifier--;
        });

        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return;
        }

        if(this.controller.activePlot && this.controller.activePlot.hasTrait('Winter')) {
            if(otherPlayer.activePlot && !otherPlayer.activePlot.hasTrait('Summer')) {
                otherPlayer.activePlot.goldModifier++;
            }
        }

        if(this.controller.selectedPlot.hasTrait('Winter') && !otherPlayer.selectedPlot.hasTrait('Summer')) {
            this.game.addMessage('{0} uses {1} to reduce the gold value of {2}\'s revealed non-Summer plot', this.controller, this, otherPlayer);
            otherPlayer.selectedPlot.goldModifier--;
        }
    }
}

KingsOfWinter.code = '04038';

module.exports = KingsOfWinter;
