import GameAction from './GameAction.js';
import { Flags } from '../Constants/index.js';

class RecyclePlots extends GameAction {
    constructor() {
        super('recyclePlots');
    }

    canChangeGameState({ player }) {
        return (
            player.plotDiscard.length > 0 &&
            !player.plotDeck.some(
                (plot) =>
                    !plot.hasFlag(Flags.card.notConsideredToBeInPlotDeck) &&
                    !plot.hasFlag(Flags.card.notConsideredWhenRecyclingPlots)
            )
        );
    }

    createEvent({ player }) {
        return this.event('onPlotsRecycled', { player }, (event) => {
            for (const plot of [...event.player.plotDiscard]) {
                event.player.placeCardInPile({ card: plot, location: 'plot deck' });
            }
        });
    }
}

export default new RecyclePlots();
