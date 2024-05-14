const GameActions = require('../GameActions');

class ReturnToHandCost {
    constructor() {
        this.name = 'returnToHand';
    }

    isEligible(card) {
        return card.location === 'play area' && GameActions.returnCardToHand({ card }).allow();
    }

    pay(cards, context) {
        for (let card of cards) {
            context.player.returnCardToHand(card, false);
        }
    }
}

module.exports = ReturnToHandCost;
