const GameAction = require('./GameAction');
const LeavePlay = require('./LeavePlay');
const PlaceCard = require('./PlaceCard');

class SacrificeCard extends GameAction {
    constructor() {
        super('sacrifice');
    }

    canChangeGameState({ card }) {
        return card.location === 'play area' && LeavePlay.allow({ card });
    }

    createEvent({ card, player }) {
        player = player || card.controller;
        const sacrificeEvent = this.event('onSacrificed', { card, player }, event => {
            event.cardStateWhenSacrificed = event.card.createSnapshot();
            event.thenAttachEvent(PlaceCard.createEvent({ card: card, location: 'discard pile' }));
        });
        const leavePlayEvent = LeavePlay.createEvent({ card });
        return this.atomic(sacrificeEvent, leavePlayEvent);
    }
}

module.exports = new SacrificeCard();
