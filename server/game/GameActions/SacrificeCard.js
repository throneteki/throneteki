import GameAction from './GameAction.js';
import Message from '../Message.js';
import LeavePlay from './LeavePlay.js';
import PlaceCard from './PlaceCard.js';

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
        const sacrificeEvent = this.event('onSacrificed', params, (event) => {
            event.thenAttachEvent(PlaceCard.createEvent({ card: card, location: 'discard pile' }));
        });
        const leavePlayEvent = LeavePlay.createEvent({ card });
        return this.atomic(sacrificeEvent, leavePlayEvent);
    }
}

export default new SacrificeCard();
