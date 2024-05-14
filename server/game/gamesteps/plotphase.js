const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const SelectPlotPrompt = require('./plot/selectplotprompt.js');
const RevealPlots = require('./revealplots.js');
const ChooseTitlePrompt = require('./plot/ChooseTitlePrompt.js');
const ActionWindow = require('./actionwindow.js');

class PlotPhase extends Phase {
    constructor(game) {
        super(game, 'plot');
        this.initialise([
            new SimpleStep(game, () => this.clearNewCards()),
            new SimpleStep(game, () => this.startPlotPhase()),
            new SimpleStep(game, () => this.announceForcedPlotSelection()),
            new SimpleStep(game, () => this.choosePlots()),
            () => new RevealPlots(game, this.getSelectedPlots()),
            new SimpleStep(game, () => this.recyclePlots()),
            () => new ChooseTitlePrompt(game, game.titlePool),
            new ActionWindow(this.game, 'After plots revealed', 'plot')
        ]);
    }

    clearNewCards() {
        for (const card of this.game.allCards) {
            card.new = false;
        }
    }

    startPlotPhase() {
        for (const player of this.game.getPlayers()) {
            player.resetForStartOfRound();
        }
    }

    announceForcedPlotSelection() {
        for (const player of this.game.getPlayers()) {
            if (player.mustRevealPlot) {
                this.game.addMessage('{0} is forced to select a plot', player);
            } else if (player.hasFlag('cannotRevealPlot')) {
                this.game.addMessage('{0} cannot reveal a new plot', player);
            }
        }
    }

    choosePlots() {
        let choosingPlayers = this.game
            .getPlayers()
            .filter((player) => !player.mustRevealPlot && !player.hasFlag('cannotRevealPlot'));
        this.game.raiseEvent('onChoosePlot', { players: choosingPlayers }, () => {
            this.game.queueStep(new SelectPlotPrompt(this.game));
        });
    }

    recyclePlots() {
        for (const player of this.game.getPlayers()) {
            player.recyclePlots();
        }
    }

    getSelectedPlots() {
        const revealingPlayers = this.game
            .getPlayers()
            .filter((player) => !!player.selectedPlot && !player.hasFlag('cannotRevealPlot'));
        return revealingPlayers.map((player) => player.selectedPlot);
    }
}

module.exports = PlotPhase;
