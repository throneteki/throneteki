import GameActions from '../GameActions/index.js';
import RevealCards from '../GameActions/RevealCards.js';

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

export default RevealCost;
