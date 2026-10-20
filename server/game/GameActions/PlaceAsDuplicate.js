import GameAction from './GameAction.js';
import Message from '../Message.js';

class PlaceAsDuplicate extends GameAction {
    constructor() {
        super('placeAsDuplicate');
    }

    message({ card, parent }) {
        return Message.fragment('places {card} on {parent} as a duplicate', { card, parent });
    }

    canChangeGameState({ card, parent }) {
        return (
            !!card &&
            !!parent &&
            parent.location === 'play area' &&
            !['play area', 'duplicate'].includes(card.location)
        );
    }

    createEvent({ card, parent, facedown = false }) {
        return this.event('onDupeEntersPlay', { card, target: parent }, (event) => {
            event.card.controller.removeCardFromPile(event.card);
            event.target.addDuplicate(event.card);
            event.card.facedown = facedown;
        });
    }
}

export default new PlaceAsDuplicate();
