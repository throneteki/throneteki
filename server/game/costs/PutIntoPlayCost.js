class PutIntoPlayCost {
    constructor() {
        this.name = 'putIntoPlay';
    }

    isEligible(card, context) {
        return card.location !== 'play area' && context.player.canPutIntoPlay(card);
    }

    pay(cards, context) {
        for (let card of cards) {
            context.player.putIntoPlay(card);
        }
    }
}

module.exports = PutIntoPlayCost;
