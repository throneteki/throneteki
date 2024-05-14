import GameActions from '../GameActions/index.js';
import LeavePlay from '../GameActions/LeavePlay.js';

class PutIntoShadowsCost {
    constructor() {
        this.name = 'putIntoShadows';
    }

    isEligible(card) {
        if (card.location === 'play area' && !LeavePlay.allow({ card })) {
            return false;
        }
        return card.location !== 'shadows';
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.simultaneously(
                cards.map((card) => GameActions.putIntoShadows({ card, reason: 'cost' }))
            )
        );
    }
}

export default PutIntoShadowsCost;
