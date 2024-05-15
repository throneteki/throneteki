import PlotCard from '../../plotcard.js';

class AFeastForCrows extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event) =>
                    event.winner === this.controller && this.controller.canGainFactionPower()
            },
            handler: () => {
                this.game.addMessage(
                    '{0} uses {1} to gain 2 power for their faction',
                    this.controller,
                    this
                );
                this.game.addPower(this.controller, 2);
            }
        });
    }
}

AFeastForCrows.code = '01002';

export default AFeastForCrows;
