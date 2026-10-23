import GameAction from './GameAction.js';
import Message from '../Message.js';
import LeavePlay from './LeavePlay.js';
import MoveCardEventGenerator from './MoveCardEventGenerator.js';

class RemoveFromGame extends GameAction {
    constructor() {
        super('removeFromGame');
    }

    message({ card, facedown = false }) {
        return facedown
            ? Message.fragment('removes a card from the game facedown')
            : Message.fragment('removes {card} from the game', { card });
    }

    canChangeGameState({ card }) {
        return card.location !== 'out of game';
    }

    createEvent({ card, player, allowSave = true, facedown = false }) {
        player = player || card.controller;
        const params = {
            allowSave,
            card,
            player,
            snapshotName: 'cardStateWhenRemoved'
        };
        const removeEvent = this.event('onCardRemovedFromGame', params, (event) => {
            const placeEvent = MoveCardEventGenerator.createPlaceCardEvent({
                card: event.card,
                player: event.player,
                location: 'out of game'
            });
            if (facedown) {
                placeEvent.thenExecute(() => {
                    event.card.facedown = true;
                });
            }
            event.thenAttachEvent(placeEvent);
        });

        if (['play area', 'duplicate'].includes(card.location)) {
            return this.atomic(removeEvent, LeavePlay.createEvent({ card, allowSave }));
        }

        return removeEvent;
    }
}

export default new RemoveFromGame();
