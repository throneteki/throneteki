import GameAction from './GameAction.js';
import LeavePlay from './LeavePlay.js';
import Message from '../Message.js';

class ReturnPlotToDeck extends GameAction {
    constructor() {
        super('returnPlotToDeck');
    }

    message({ card }) {
        return Message.fragment('returns {card} to their plot deck', { card });
    }

    canChangeGameState({ card }) {
        return !!card && card.getType() === 'plot' && card.location === 'active plot';
    }

    createEvent({ card, player = card.controller }) {
        const returnEvent = this.event('onPlotReturnedToDeck', { card, player }, (event) => {
            event.player.activePlot = null;
            event.player.placeCardInPile({ card: event.card, location: 'plot deck' });
        });
        return this.atomic(returnEvent, LeavePlay.createEvent({ card }));
    }
}

export default new ReturnPlotToDeck();
