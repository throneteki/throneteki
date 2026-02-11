import Phase from './phase.js';
import SimpleStep from './simplestep.js';
import SelectPlotPrompt from './plot/selectplotprompt.js';
import RevealPlots from './revealplots.js';
import ChooseTitlePrompt from './plot/ChooseTitlePrompt.js';
import ActionWindow from './actionwindow.js';
import { Flags } from '../Constants/index.js';

class PlotPhase extends Phase {
    constructor(game) {
        super(game, 'plot');
        this.initialise([
            new SimpleStep(game, () => this.clearNewCards()),
            new SimpleStep(game, () => this.startPlotPhase()),
            new SimpleStep(game, () => this.announceForcedPlotSelection()),
            new SimpleStep(game, () => this.choosePlots()),
            () => new RevealPlots(game, this.getSelectedPlots()),
            new SimpleStep(game, () => this.chooseTitles()),
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
            } else if (player.hasFlag(Flags.player.cannotRevealPlot)) {
                this.game.addMessage('{0} cannot reveal a new plot', player);
            }
        }
    }

    choosePlots() {
        let choosingPlayers = this.game
            .getPlayers()
            .filter(
                (player) => !player.mustRevealPlot && !player.hasFlag(Flags.player.cannotRevealPlot)
            );
        this.game.raiseEvent('onChoosePlot', { players: choosingPlayers }, () => {
            this.game.queueStep(new SelectPlotPrompt(this.game));
        });
    }

    recyclePlots() {
        for (const player of this.game.getPlayers()) {
            player.recyclePlots();
        }
    }

    chooseTitles() {
        if (this.game.isMelee) {
            this.game.queueStep(new ChooseTitlePrompt(this.game, this.game.titlePool));
        }
    }

    getSelectedPlots() {
        const revealingPlayers = this.game
            .getPlayers()
            .filter(
                (player) => !!player.selectedPlot && !player.hasFlag(Flags.player.cannotRevealPlot)
            );
        return revealingPlayers.map((player) => player.selectedPlot);
    }
}

export default PlotPhase;
