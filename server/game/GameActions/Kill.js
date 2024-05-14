import GameAction from './GameAction.js';
import Message from '../Message.js';
import LeavePlay from './LeavePlay.js';
import PlaceCard from './PlaceCard.js';

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
        const event = this.event('onCharacterKilled', params, (event) => {
            event.thenAttachEvent(
                PlaceCard.createEvent({
                    card: event.card,
                    player: event.player,
                    location: 'dead pile'
                })
            );
        });

        const leavePlayEvent = LeavePlay.createEvent({ card, allowSave });

        return this.atomic(event, leavePlayEvent);
    }
}

export default new Kill();
