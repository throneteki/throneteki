const GameAction = require('./GameAction');

class AddToHand extends GameAction {
    constructor() {
        super('addToHand');
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
