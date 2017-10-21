class StandCost {
    constructor() {
        this.name = 'stand';
    }

    isEligible(card) {
        return card.location === 'play area' && card.kneeled;
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.standCard(card);
        }
    }
}

module.exports = StandCost;
