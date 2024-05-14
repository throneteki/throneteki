class PlaceInDeadPileFromHandCost {
    constructor() {
        this.name = 'placeInDeadPileFromHand';
    }

    isEligible(card) {
        return card.location === 'hand';
    }

    pay(cards, context) {
        for (let card of cards) {
            context.player.moveCard(card, 'dead pile');
        }
    }
}

export default PlaceInDeadPileFromHandCost;
