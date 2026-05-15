class ParticipationTracker {
    static forPhase(game) {
        return new ParticipationTracker(game, 'onPhaseEnded');
    }

    constructor(game, endingEvent) {
        this.attackers = [];
        this.defenders = [];
        game.on('onDeclaredAsAttacker', (event) => this.trackAttacker(event.card));
        game.on('onDeclaredAsDefender', (event) => this.trackDefender(event.card));
        game.on(endingEvent, () => this.clearCards());
    }

    trackAttacker(card) {
        this.attackers.push(card);
    }

    trackDefender(card) {
        this.defenders.push(card);
    }

    clearCards() {
        this.attackers = [];
        this.defenders = [];
    }

    hasParticipated(card) {
        return this.attackers.includes(card) || this.defenders.includes(card);
    }

    hasAttacked(card) {
        return this.attackers.includes(card);
    }

    hasDefended(card) {
        return this.defenders.includes(card);
    }
}

export default ParticipationTracker;
