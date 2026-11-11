import GameAction from './GameAction.js';
import Message from '../Message.js';

class PlaceAsDuplicate extends GameAction {
    constructor() {
        super('placeAsDuplicate');
    }

    message({ card, parent, facedown = false }) {
        if (facedown) {
            return Message.fragment('places a facedown card on {parent} as a duplicate', {
                parent
            });
        }

        return Message.fragment('places {card} on {parent} as a duplicate', { card, parent });
    }

    canChangeGameState({ card, parent }) {
        return (
            !!card &&
            !!parent &&
            card !== parent &&
            parent.location === 'play area' &&
            parent.canBeDuplicated() &&
            card.location !== 'duplicate'
        );
    }

    createEvent({ card, parent, facedown = false }) {
        if (card.location === 'play area') {
            return this.event('onCardPlacedAsDuplicate', { card, target: parent }, (event) => {
                // A card in play stays in play as a duplicate, so it keeps its power and tokens.
                const { power, tokens } = event.card;
                event.card.controller.removeCardFromPile(event.card);
                event.target.addDuplicate(event.card);
                event.card.power = power;
                event.card.tokens = tokens;
            });
        }

        return this.event('onDupeEntersPlay', { card, target: parent }, (event) => {
            event.card.controller.removeCardFromPile(event.card);
            event.target.addDuplicate(event.card);
            event.card.facedown = facedown;
        });
    }
}

export default new PlaceAsDuplicate();
