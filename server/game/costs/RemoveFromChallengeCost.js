class RemoveFromChallengeCost {
    constructor() {
        this.name = 'removeFromChallenge';
    }

    isEligible(card, context) {
        let challenge = context.game.currentChallenge;
        return !!challenge && challenge.isParticipating(card);
    }

    pay(cards, context) {
        let challenge = context.game.currentChallenge;
        for (let card of cards) {
            challenge.removeFromChallenge(card);
        }
    }
}

export default RemoveFromChallengeCost;
