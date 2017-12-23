class DiscardTokenCost {
    constructor(token, amount) {
        this.name = 'discardToken';
        this.token = token;
        this.amount = amount;
    }

    isEligible(card) {
        return card.tokens[this.token] >= this.amount;
    }

    pay(cards) {
        for(let card of cards) {
            card.modifyToken(this.token, -this.amount);
        }
    }
}

module.exports = DiscardTokenCost;
