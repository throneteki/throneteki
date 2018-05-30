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
            new SimpleStep(game, () => this.removeActivePlots()),
            new SimpleStep(game, () => this.flipPlotsFaceup()),
            () => new RevealPlots(game, this.getActivePlots()),
            new SimpleStep(game, () => this.recyclePlots()),
            () => new ChooseTitlePrompt(game, game.titlePool),
            new ActionWindow(this.game, 'After plots revealed', 'plot')
        ]);
    }

    clearNewCards() {
        for(const card of this.game.allCards) {
            card.new = false;
        }
    }

    startPlotPhase() {
        for(const player of this.game.getPlayers()) {
            player.startPlotPhase();
        }
    }

    announceForcedPlotSelection() {
        for(const player of this.game.getPlayers()) {
            if(player.mustRevealPlot) {
                this.game.addMessage('{0} is forced to select a plot', player);
            }
        }
    }

    choosePlots() {
        let choosingPlayers = this.game.getPlayers().filter(player => !player.mustRevealPlot);
        this.game.raiseEvent('onChoosePlot', { players: choosingPlayers }, () => {
            this.game.queueStep(new SelectPlotPrompt(this.game));
        });
    }

    removeActivePlots() {
        for(const player of this.game.getPlayers()) {
            player.removeActivePlot();
        }
    }

    flipPlotsFaceup() {
        for(const player of this.game.getPlayers()) {
            player.flipPlotFaceup();
        }
    }

    recyclePlots() {
        for(const player of this.game.getPlayers()) {
            player.recyclePlots();
        }
    }

    getActivePlots() {
        return this.game.getPlayers().filter(player => !!player.activePlot).map(player => player.activePlot);
    }
}

module.exports = PlotPhase;
