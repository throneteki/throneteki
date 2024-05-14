const GameAction = require('./GameAction');
const DiscardPlot = require('./DiscardPlot');
const PlaceCard = require('./PlaceCard');

class RevealPlot extends GameAction {
    constructor() {
        super('revealPlot');
    }

    canChangeGameState({ card }) {
        return card.getType() === 'plot' && card.location !== 'active plot';
    }

    createEvent({ card, player }) {
        const event = this.event('__REVEAL_PLOT__', { card, player }, (event) => {
            event.player.selectedPlot = null;
            event.card.flipFaceup();
            event.thenAttachEvent(PlaceCard.createEvent({ card, player, location: 'active plot' }));
        });
        const entersPlayEvent = this.event('onCardEntersPlay', {
            card,
            playingType: 'plot',
            originalLocation: card.location
        });
        const events = [event, entersPlayEvent];

        if (player.activePlot) {
            events.push(DiscardPlot.createEvent({ card: player.activePlot, player }));
        }

        return this.atomic(...events);
    }
}

module.exports = new RevealPlot();
