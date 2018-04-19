const PlotCard = require('../../plotcard.js');

class WinterFestival extends PlotCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: event => {
                    if(event.phase !== 'challenge') {
                        return false;
                    }

                    if(this.game.getPlayers().some(player => {
                        return player.activePlot.hasTrait('Summer');
                    })) {
                        return false;
                    }

                    return true;
                }
            },
            handler: () => {
                this.game.addPower(this.controller, 2);

                this.game.addMessage('{0} gains 2 power from {1}', this.controller, this);
            }
        });
    }
}

WinterFestival.code = '04040';

module.exports = WinterFestival;
