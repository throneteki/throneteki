const GameAction = require('./GameAction');
const DiscardCard = require('./DiscardCard');
const SimultaneousEvents = require('../SimultaneousEvents');

class DiscardAtRandom extends GameAction {
    constructor() {
        super('discardAtRandom');
    }

    canChangeGameState({ amount = 1, player }) {
        return amount >= 1 && player.hand.length >= 1;
    }

    createEvent({ amount = 1, player, discardEvent = card => DiscardCard.createEvent({ card, allowSave: false }) }) {
        const actualAmount = Math.min(amount, player.hand.length);
        const cards = [];

        while(cards.length < actualAmount) {
            let cardIndex = Math.floor(Math.random() * player.hand.length);

            let card = player.hand[cardIndex];
            if(!cards.includes(card)) {
                cards.push(card);
            }
        }
        const event = new SimultaneousEvents();

        for(const card of cards) {
            let childEvent = discardEvent(card);
            event.addChildEvent(childEvent);
        }

        // Need to print the message here as the cards being discarded (at random) aren't determined before the event is created; which is when GameAction.message() is called
        event.thenExecute(() => {
            player.game.addMessage('{0} discards {1} at random from their hand', player, cards);
        });

        return event;
    }
}

module.exports = new DiscardAtRandom();
