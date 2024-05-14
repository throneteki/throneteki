import GameAction from './GameAction.js';
import LeavePlay from './LeavePlay.js';
import PlaceCard from './PlaceCard.js';

class DiscardPlot extends GameAction {
    constructor() {
        super('discardPlot');
    }

    canChangeGameState({ card }) {
        return card.getType() === 'plot' && card.location === 'active plot';
    }

    createEvent({ card, player }) {
        const discardPlotEvent = this.event('onPlotDiscarded', { card, player }, (event) => {
            event.thenAttachEvent(
                PlaceCard.createEvent({ card, player, location: 'revealed plots' })
            );
        });
        const leavesPlayEvent = LeavePlay.createEvent({ card });
        return this.atomic(discardPlotEvent, leavesPlayEvent);
    }
}

export default new DiscardPlot();
