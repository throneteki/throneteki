class PowerAsGoldSource {
    constructor(card, allowSpendingFunc = () => true) {
        this.card = card;
        this.allowSpendingFunc = allowSpendingFunc;
        this.goldMultiplier = 2;
    }

    get gold() {
        return this.card.power * this.goldMultiplier;
    }

    get name() {
        return `${this.card.name}'s power`;
    }

    allowSpendingFor(spendParams) {
        return this.allowSpendingFunc(spendParams);
    }

    modifyGold(amount, player) {
        let powerAmount = Math.ceil(amount / this.goldMultiplier);
        this.card.game.addMessage('{0} uses {1} power on {2}', player, -powerAmount, this.card);
        this.card.modifyPower(powerAmount);
    }
}

export default PowerAsGoldSource;
