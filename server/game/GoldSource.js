class GoldSource {
    constructor(playerOrCard, allowSpendingFunc = () => true) {
        this.playerOrCard = playerOrCard;
        this.allowSpendingFunc = allowSpendingFunc;
    }

    get gold() {
        return this.playerOrCard.gold;
    }

    get name() {
        if (this.playerOrCard.getGameElementType() === 'player') {
            return `${this.playerOrCard.name}'s gold pool`;
        }

        return this.playerOrCard.name;
    }

    allowSpendingFor(spendParams) {
        return this.allowSpendingFunc(spendParams);
    }

    modifyGold(amount) {
        this.playerOrCard.modifyGold(amount);
    }
}

export default GoldSource;
