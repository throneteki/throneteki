import GameAction from './GameAction.js';
import Message from '../Message.js';
import MoveCardEventGenerator from './MoveCardEventGenerator.js';

class PlaceInDeadPile extends GameAction {
    constructor() {
        super('placeInDeadPile');
    }

    canChangeGameState({ card }) {
        return card.getType() === 'character' && card.location !== 'dead pile';
    }

    message({ card }) {
        return Message.fragment("places {card} in its owner's dead pile", { card });
    }

    createEvent({ card }) {
        const placed = MoveCardEventGenerator.createPlaceCardEvent({ card, location: 'dead pile' });
        if (['play area', 'duplicate'].includes(card.location)) {
            return this.atomic(
                placed,
                MoveCardEventGenerator.createLeavePlayEvent({ card, allowSave: false })
            );
        }
        return placed;
    }
}

export default new PlaceInDeadPile();
