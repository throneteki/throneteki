class RevealCost {
    constructor() {
        this.name = 'reveal';
    }

    isEligible(card) {
        return card.location === 'hand';
    }

    pay(cards, context) {
        context.game.addMessage('{0} reveals {1} from their hand', context.player, cards);
    }
}

module.exports = RevealCost;
