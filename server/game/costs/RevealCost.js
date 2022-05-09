const GameActions = require('../GameActions');

class RevealCost {
    constructor() {
        this.name = 'reveal';
    }

    isEligible(card) {
        return ['hand', 'plot deck', 'shadows'].includes(card.location);
    }

    pay(cards, context) {
        context.game.resolveGameAction(GameActions.revealCards({ cards, player: context.player, context }));
    }
}

module.exports = RevealCost;
