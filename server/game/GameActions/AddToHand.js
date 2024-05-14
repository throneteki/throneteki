const GameAction = require('./GameAction');
const Message = require('../Message');

class AddToHand extends GameAction {
    constructor() {
        super('addToHand');
    }

    message({ card, context }) {
        return Message.fragment('adds {card}{from} to their hand', {
            card: context.revealed && context.revealed.includes(card) ? card : 'a card',
            from:
                context.revealed && context.revealed.includes(card)
                    ? ''
                    : Message.fragment(' from their {originalLocation}', {
                          originalLocation: card.location
                      })
        });
    }

    canChangeGameState({ card }) {
        return card.location !== 'hand';
    }

    createEvent({ card }) {
        return this.event('onCardAddedToHand', { card }, (event) => {
            event.card.owner.placeCardInPile({ card: event.card, location: 'hand' });
        });
    }
}

module.exports = new AddToHand();
