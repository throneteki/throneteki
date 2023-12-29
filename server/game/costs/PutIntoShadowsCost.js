const GameActions = require('../GameActions');
const LeavePlay = require('../GameActions/LeavePlay');

class PutIntoShadowsCost {
    constructor() {
        this.name = 'putIntoShadows';
    }

    isEligible(card) {
        if(card.location === 'play area' && !LeavePlay.allow({ card })) {
            return false;
        }
        return card.location !== 'shadows';
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.simultaneously(
                cards.map(card => GameActions.putIntoShadows({ card, reason: 'cost' }))
            )
        );
    }
}

module.exports = PutIntoShadowsCost;
