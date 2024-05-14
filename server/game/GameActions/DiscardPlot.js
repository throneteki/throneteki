const GameAction = require('./GameAction');
const LeavePlay = require('./LeavePlay');
const PlaceCard = require('./PlaceCard');

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

module.exports = new DiscardPlot();
