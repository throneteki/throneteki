class KneelCost {
    constructor() {
        this.name = 'kneel';
    }

    isEligible(card) {
        return ['faction', 'play area'].includes(card.location) && !card.kneeled;
    }

    pay(cards, context) {
        for(let card of cards) {
            context.player.kneelCard(card);
        }
    }
}

module.exports = KneelCost;
