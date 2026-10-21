import PlotCard from '../../plotcard.js';

class WinterFestival extends PlotCard {
    // Winter Festival (04040)
    // Interrupt: When the challenges phase ends, if there are no Summer plot cards revealed, gain 2
    // power for your faction.
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

export default WinterFestival;
