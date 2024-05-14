const GameAction = require('./GameAction');

class DiscardToken extends GameAction {
    constructor() {
        super('discardToken');
    }

    canChangeGameState({ card, token, amount = 1 }) {
        return (
            ['active plot', 'agenda', 'play area', 'shadows', 'title'].includes(card.location) &&
            amount > 0 &&
            card.hasToken(token)
        );
    }

    createEvent({ card, token, amount = 1 }) {
        const actualAmount = Math.min(amount, card.tokens[token]);
        const isFullyResolved = (event) => event.amount === event.desiredAmount;
        return this.event(
            'onTokenDiscarded',
            { card, token, amount: actualAmount, desiredAmount: amount, isFullyResolved },
            (event) => {
                event.card.modifyToken(event.token, -event.amount);
            }
        );
    }
}

module.exports = new DiscardToken();
