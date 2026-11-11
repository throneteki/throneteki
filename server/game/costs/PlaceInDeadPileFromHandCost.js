import GameActions from '../GameActions/index.js';

class PlaceInDeadPileFromHandCost {
    constructor() {
        this.name = 'placeInDeadPileFromHand';
    }

    isEligible(card) {
        return card.location === 'hand';
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.simultaneously(
                cards.map((card) => GameActions.placeCard({ card, location: 'dead pile' }))
            ),
            context
        );
    }
}

export default PlaceInDeadPileFromHandCost;
