const GameAction = require('./GameAction');
const Message = require('../Message');
const LeavePlay = require('./LeavePlay');
const PlaceCard = require('./PlaceCard');

class SacrificeCard extends GameAction {
    constructor() {
        super('sacrifice');
    }

    message({ card }) {
        return Message.fragment('sacrifices {card}', { card });
    }

    canChangeGameState({ card }) {
        return card.location === 'play area' && LeavePlay.allow({ card });
    }

    createEvent({ card, player }) {
        player = player || card.controller;
        const params = {
            card,
            player,
            snapshotName: 'cardStateWhenSacrificed'
        };
        const sacrificeEvent = this.event('onSacrificed', params, event => {
            event.thenAttachEvent(PlaceCard.createEvent({ card: card, location: 'discard pile' }));
        });
        const leavePlayEvent = LeavePlay.createEvent({ card });
        return this.atomic(sacrificeEvent, leavePlayEvent);
    }
}

module.exports = new SacrificeCard();
