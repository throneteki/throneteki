class ParticipationTracker {
    static forPhase(game) {
        return new ParticipationTracker(game, 'onPhaseEnded');
    }

    constructor(game, endingEvent) {
        this.challenges = [];
        game.on('onChallengeInitiated', (event) => this.trackChallenge(event.challenge));
        game.on(endingEvent, () => this.clearChallenges());
    }

    trackChallenge(challenge) {
        this.challenges.push(challenge);
    }

    clearChallenges() {
        this.challenges = [];
    }

    hasParticipated(card) {
        return this.challenges.some((challenge) => challenge.hasParticipated(card));
    }
}

export default ParticipationTracker;
