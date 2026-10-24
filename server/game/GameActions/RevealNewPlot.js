import GameAction from './GameAction.js';
import Message from '../Message.js';
import RevealPlots from '../gamesteps/revealplots.js';

class RevealNewPlot extends GameAction {
    constructor() {
        super('revealNewPlot');
    }

    message({ card }) {
        return Message.fragment('reveals {card}', { card });
    }

    canChangeGameState({ card }) {
        return card.getType() === 'plot' && card.location === 'plot deck';
    }

    createEvent({ card, player = card.controller, parentEvent = null }) {
        return this.event('onNewPlotChosen', { card, player }, (event) => {
            event.player.selectedPlot = event.card;
            event.player.game.queueStep(
                new RevealPlots(event.player.game, [event.card], parentEvent)
            );
        });
    }
}

export default new RevealNewPlot();
