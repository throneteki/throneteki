const _ = require('underscore');
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
            new SelectPlotPrompt(game),
            new SimpleStep(game, () => this.removeActivePlots()),
            new SimpleStep(game, () => this.flipPlotsFaceup()),
            () => new RevealPlots(game, _.map(this.game.getPlayers(), player => player.activePlot)),
            new SimpleStep(game, () => this.recyclePlots()),
            () => new ChooseTitlePrompt(game, game.titlePool),
            new ActionWindow(this.game, 'After plots revealed', 'plot')
        ]);
    }

    clearNewCards() {
        this.game.allCards.each(card => {
            card.new = false;
        });
    }

    startPlotPhase() {
        _.each(this.game.getPlayers(), player => {
            player.startPlotPhase();
        });
    }

    removeActivePlots() {
        _.each(this.game.getPlayers(), player => {
            player.removeActivePlot();
        });
    }

    flipPlotsFaceup() {
        _.each(this.game.getPlayers(), player => {
            player.flipPlotFaceup();
        });
    }

    recyclePlots() {
        _.each(this.game.getPlayers(), player => {
            player.recyclePlots();
        });
    }
}

module.exports = PlotPhase;
