const GameAction = require('./GameAction');
const Message = require('../Message');
const LeavePlay = require('./LeavePlay');
const PlaceCard = require('./PlaceCard');

class Kill extends GameAction {
    constructor() {
        super('kill');
    }

    message({ card }) {
        return Message.fragment('kills {card}', { card });
    }

    canChangeGameState({ card }) {
        return card.location === 'play area' && card.getType() === 'character';
    }

    createEvent({ card, player, allowSave = true, isBurn = false }) {
        const params = {
            card,
            player: player || card.controller,
            allowSave,
            isBurn,
            snapshotName: 'cardStateWhenKilled'
        };
        const event = this.event('onCharacterKilled', params, event => {
            event.thenAttachEvent(PlaceCard.createEvent({ card: event.card, player: event.player, location: 'dead pile' }));
        });

        const leavePlayEvent = LeavePlay.createEvent({ card, allowSave });

        return this.atomic(event, leavePlayEvent);
    }
}

module.exports = new Kill();
