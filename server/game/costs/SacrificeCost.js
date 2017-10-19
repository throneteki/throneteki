class SacrificeCost {
    constructor() {
        this.name = 'sacrifice';
    }

    isEligible(card) {
        return card.location === 'play area';
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.sacrificeCard(card);
        }
    }
}

module.exports = SacrificeCost;
