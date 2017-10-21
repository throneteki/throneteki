class DiscardPowerCost {
    constructor(amount) {
        this.name = 'discardPower';
        this.amount = amount;
    }

    isEligible(card) {
        return ['faction', 'play area'].includes(card.location) && card.getPower() >= this.amount;
    }

    pay(cards) {
        for(let card of cards) {
            card.modifyPower(-this.amount);
        }
    }
}

module.exports = DiscardPowerCost;
