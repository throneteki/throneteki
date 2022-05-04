const GameAction = require('./GameAction');

class AddToHand extends GameAction {
    constructor() {
        super('addToHand');
    }

    canChangeGameState({ card, fromLocation }) {
        return card.location !== 'hand' && (!fromLocation || fromLocation === card.location );
    }

    createEvent({ card, fromLocation }) {
        return this.event('onCardAddedToHand', { card, fromLocation }, event => {
            event.card.owner.placeCardInPile({ card: event.card, location: 'hand', fromLocation: event.fromLocation });
        });
    }
}

module.exports = new AddToHand();
