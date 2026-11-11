import GameActions from '../GameActions/index.js';

class DiscardTokenCost {
    constructor(token, amount) {
        this.name = 'discardToken';
        this.token = token;
        this.amount = amount;
    }

    getAmount(card) {
        return typeof this.amount === 'function' ? this.amount(card) : this.amount;
    }

    isEligible(card) {
        return card.tokens[this.token] >= this.getAmount(card);
    }

    pay(cards, context) {
        context.game.resolveGameAction(
            GameActions.simultaneously(
                cards.map((card) =>
                    GameActions.discardToken({
                        card,
                        token: this.token,
                        amount: this.getAmount(card)
                    })
                )
            )
        );
    }
}

export default DiscardTokenCost;
