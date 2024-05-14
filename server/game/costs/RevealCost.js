const GameActions = require('../GameActions');
const RevealCards = require('../GameActions/RevealCards');

class RevealCost {
    constructor() {
        this.name = 'reveal';
    }

    isEligible(card, context) {
        return RevealCards.allow({ cards: [card], context });
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.revealCards({
                cards,
                player: context.player,
                revealWithMessage: false,
                context
            })
        );
    }
}

module.exports = RevealCost;
