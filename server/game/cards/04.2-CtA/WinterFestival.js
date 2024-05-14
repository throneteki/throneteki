const PlotCard = require('../../plotcard.js');

class WinterFestival extends PlotCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' &&
                    !this.game.anyPlotHasTrait('Summer') &&
                    this.controller.canGainFactionPower()
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
