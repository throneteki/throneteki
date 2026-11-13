class DiscardFromShadowsCost {
    constructor() {
        this.name = 'discardFromShadows';
    }

    isEligible(card) {
        return card.location === 'shadows';
    }

    pay(cards, context) {
        context.player.discardCards(cards, false);
    }
}

export default DiscardFromShadowsCost;
