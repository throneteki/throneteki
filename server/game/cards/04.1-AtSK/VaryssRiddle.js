const PlotCard = require('../../plotcard.js');

class VaryssRiddle extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let opponents = this.game.getOpponents(this.controller);
                this.nonRiddlePlots = opponents.map(opponent => opponent.activePlot).filter(plot => !plot.hasTrait('Riddle'));

                if(this.resolving || this.nonRiddlePlots.length === 0) {
                    return;
                }

                if(this.nonRiddlePlots.length === 1) {
                    this.resolveWhenRevealed(this.nonRiddlePlots[0]);
                    return;
                }

                // TODO: It would be more consistent if this were a card select
                // prompt, but that requires a bunch of reworking on the client
                // side to allow clicking of the active plot.
                let buttons = this.nonRiddlePlots.map(plot => {
                    return { text: `${plot.owner.name} - ${plot.name}`, method: 'selectPlot', card: plot };
                });
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a plot',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    selectPlot(player, plotId) {
        let plot = this.nonRiddlePlots.find(plot => plot.uuid === plotId);
        this.resolveWhenRevealed(plot);
        return true;
    }

    resolveWhenRevealed(plot) {
        this.game.addMessage('{0} uses {1} to initiate the When Revealed ability of {2}', this.controller, this, plot);
        plot.controller = this.controller;
        this.resolving = true;

        this.game.raiseEvent('onPlotsWhenRevealed', { plots: [plot] });
        this.game.queueSimpleStep(() => {
            this.resolving = false;
            plot.controller = plot.owner;
        });
    }
}

VaryssRiddle.code = '04020';

module.exports = VaryssRiddle;
