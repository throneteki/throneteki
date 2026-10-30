import GameAction from './GameAction.js';
import Message from '../Message.js';
import PlaceAsDuplicate from './PlaceAsDuplicate.js';

class MarshalAsDuplicate extends GameAction {
    constructor() {
        super('marshalAsDuplicate');
    }

    message({ card, parent }) {
        return Message.fragment('marshals {card} as a duplicate on {parent}', { card, parent });
    }

    canChangeGameState({ card, parent }) {
        return PlaceAsDuplicate.allow({ card, parent });
    }

    createEvent({ card, parent, player = card.controller }) {
        const params = {
            card,
            originalController: card.controller,
            originalLocation: card.location,
            originalParent: card.parent,
            player,
            type: 'dupe',
            wasFacedownAttachment: false
        };
        return this.event('onCardMarshalled', params, (event) => {
            event.thenAttachEvent(PlaceAsDuplicate.createEvent({ card: event.card, parent }));
        });
    }
}

export default new MarshalAsDuplicate();
