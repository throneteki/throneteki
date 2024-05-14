const GameActions = require('../GameActions');

class ShuffleCardIntoDeckCost {
    constructor() {
        this.name = 'shuffleCardIntoDeckCost';
    }

    isEligible(card) {
        return (
            card.location === 'play area' && GameActions.shuffleIntoDeck({ cards: [card] }).allow()
        );
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.shuffleIntoDeck(() => ({
                cards: cards,
                allowSave: false
            })),
            context
        );
    }
}

module.exports = ShuffleCardIntoDeckCost;
