class ParticipationTracker {
    static forPhase(game) {
        return new ParticipationTracker(game, 'onPhaseEnded');
    }

    constructor(game, endingEvent) {
        this.cards = [];
        game.on('onDeclaredAsAttacker', (event) => this.trackCard(event.card));
        game.on('onDeclaredAsDefender', (event) => this.trackCard(event.card));
        game.on(endingEvent, () => this.clearCards());
    }

    trackCard(card) {
        this.cards.push(card);
    }

    clearCards() {
        this.cards = [];
    }

    hasParticipated(card) {
        return this.cards.includes(card);
    }
}

export default ParticipationTracker;
