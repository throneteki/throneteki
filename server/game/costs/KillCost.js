class KillCost {
    constructor() {
        this.name = 'kill';
    }

    isEligible(card) {
        return (
            card.location === 'play area' && card.getType() === 'character' && card.canBeKilled()
        );
    }

    pay(cards, context) {
        context.game.killCharacters(cards, { allowSave: false });
    }
}

module.exports = KillCost;
