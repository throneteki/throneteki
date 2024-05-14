const PlotCard = require('../../plotcard.js');

class VaryssRiddle extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                let opponents = this.game.getOpponents(context.player);
                this.nonRiddlePlots = opponents
                    .map((opponent) => opponent.activePlot)
                    .filter((plot) => !plot.hasTrait('Riddle'));

                if (this.resolving || this.nonRiddlePlots.length === 0) {
                    return;
                }

                this.context = context;

                if (this.nonRiddlePlots.length === 1) {
                    this.resolveWhenRevealed(this.nonRiddlePlots[0]);
                    return;
                }

                // TODO: It would be more consistent if this were a card select
                // prompt, but that requires a bunch of reworking on the client
                // side to allow clicking of the active plot.
                let buttons = this.nonRiddlePlots.map((plot) => {
                    return {
                        text: `${plot.owner.name} - ${plot.name}`,
                        method: 'selectPlot',
                        card: plot
                    };
                });
                this.game.promptWithMenu(context.player, this, {
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
        let plot = this.nonRiddlePlots.find((plot) => plot.uuid === plotId);
        this.resolveWhenRevealed(plot);
        return true;
    }

    resolveWhenRevealed(plot) {
        this.game.addMessage(
            '{0} uses {1} to initiate the When Revealed ability of {2}',
            this.context.player,
            this,
            plot
        );
        this.resolving = true;

        let whenRevealed = plot.getWhenRevealedAbility();
        if (whenRevealed) {
            // Attach the current When Revealed event to the new context
            let context = whenRevealed.createContext(this.context.event);
            context.player = this.context.player;
            this.game.resolveAbility(whenRevealed, context);
        }
        this.game.queueSimpleStep(() => {
            this.resolving = false;
        });
    }
}

VaryssRiddle.code = '04020';

module.exports = VaryssRiddle;
