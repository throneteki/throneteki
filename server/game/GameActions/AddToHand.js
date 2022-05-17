const GameAction = require('./GameAction');
const Message = require('../Message');

class AddToHand extends GameAction {
    constructor() {
        super('addToHand');
    }

    message({ card }) {
        return Message.fragment('adds {card} to their hand', { card });
    }

    canChangeGameState({ card }) {
        return card.location !== 'hand';
    }

    createEvent({ card }) {
        return this.event('onCardAddedToHand', { card }, event => {
            event.card.owner.placeCardInPile({ card: event.card, location: 'hand' });
        });
    }
}

module.exports = new AddToHand();
