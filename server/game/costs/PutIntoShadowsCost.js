class PutIntoShadowsCost {
    constructor() {
        this.name = 'putIntoShadows';
    }

    isEligible(card) {
        return card.location !== 'shadows';
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.putIntoShadows(card, false);
        }
    }
}

module.exports = PutIntoShadowsCost;
