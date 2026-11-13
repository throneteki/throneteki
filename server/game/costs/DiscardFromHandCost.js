class DiscardFromHandCost {
    constructor() {
        this.name = 'discardFromHand';
        this.movesCard = true;
    }

    isEligible(card) {
        return card.location === 'hand';
    }

    pay(cards, context) {
        context.player.discardCards(cards, false);
    }
}

export default DiscardFromHandCost;
