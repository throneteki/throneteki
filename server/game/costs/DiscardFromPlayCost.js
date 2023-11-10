const GameActions = require('../GameActions');

class DiscardFromPlayCost {
    constructor() {
        this.name = 'discardFromPlay';
    }

    isEligible(card) {
        return card.location === 'play area' && GameActions.discardCard({ card, allowSave: false }).allow();
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.simultaneously(cards.map(card => 
                GameActions.discardCard({
                    card,
                    allowSave: false
                })
            )),
            context
        );
    }
}

module.exports = DiscardFromPlayCost;
