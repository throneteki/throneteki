const PlotCard = require('../../plotcard.js');

class RiseOfTheKraken extends PlotCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onUnopposedGain: (event) =>
                    event.challenge.winner === this.controller &&
                    this.controller.canGainFactionPower()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to gain 2 power for winning an unopposed challenge instead of 1',
                    this.controller,
                    this
                );
                context.replaceHandler(() => {
                    this.game.addPower(this.controller, 2);
                });
            }
        });
    }
}

RiseOfTheKraken.code = '02012';

module.exports = RiseOfTheKraken;
