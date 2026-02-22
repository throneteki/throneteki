// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-31: Created cost for placing cards underneath another card (e.g., agenda)

import GameActions from '../GameActions/index.js';

class PlaceCardUnderneathCost {
    constructor(parentCardFunc) {
        this.name = 'placeCardUnderneath';
        this.parentCardFunc = parentCardFunc;
    }

    isEligible(card, context) {
        const parentCard = this.parentCardFunc(context);
        if (!parentCard) {
            return false;
        }
        const gameAction = GameActions.placeCardUnderneath({ card, parentCard });
        return gameAction.allow();
    }

    pay(cards, context) {
        const parentCard = this.parentCardFunc(context);
        context.game.resolveGameAction(
            GameActions.simultaneously(() =>
                cards.map((card) =>
                    GameActions.placeCardUnderneath({
                        card,
                        parentCard,
                        facedown: true
                    })
                )
            ),
            context
        );
    }
}

export default PlaceCardUnderneathCost;
