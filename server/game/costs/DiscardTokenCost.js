class DiscardTokenCost {
    constructor(token, amount) {
        this.name = 'discardToken';
        this.token = token;
        this.amount = amount;
    }

    isEligible(card) {
        if (typeof this.amount === 'function') {
            return card.tokens[this.token] >= this.amount(card);
        }

        return card.tokens[this.token] >= this.amount;
    }

    pay(cards) {
        for (let card of cards) {
            if (typeof this.amount === 'function') {
                let amount = this.amount(card);
                card.modifyToken(this.token, -amount);
            } else {
                card.modifyToken(this.token, -this.amount);
            }
        }
    }
}

export default DiscardTokenCost;
