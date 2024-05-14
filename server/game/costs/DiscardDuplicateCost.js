class DiscardDuplicateCost {
    constructor() {
        this.name = 'discardDuplicate';
    }

    isEligible(card) {
        return card.location === 'duplicate';
    }

    pay(cards, context) {
        context.player.discardCards(cards, false);
    }
}

export default DiscardDuplicateCost;
