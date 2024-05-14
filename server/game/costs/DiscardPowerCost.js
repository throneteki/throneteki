class DiscardPowerCost {
    constructor(amount) {
        this.name = 'discardPower';
        this.amount = amount;
    }

    getAmountValue(context) {
        return (this.amount === 'X' ? context.xValue : this.amount) || 1;
    }

    isEligible(card, context) {
        return (
            ['faction', 'play area'].includes(card.location) &&
            card.getPower() >= this.getAmountValue(context)
        );
    }

    pay(cards, context) {
        let amount = this.getAmountValue(context);
        for (let card of cards) {
            card.modifyPower(-amount);
        }
    }
}

module.exports = DiscardPowerCost;
