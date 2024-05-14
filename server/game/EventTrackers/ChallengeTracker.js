export class ChallengeTracker {
    static forPhase(game) {
        return new ChallengeTracker(game, 'onPhaseEnded');
    }

    static forRound(game) {
        return new ChallengeTracker(game, 'onRoundEnded');
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

    filter(...matchers) {
        return this.challenges.filter((challenge) => {
            return matchers.some((matcher) => challenge.isMatch(matcher));
        });
    }

    some(...matchers) {
        return this.challenges.some((challenge) => {
            return matchers.some((matcher) => challenge.isMatch(matcher));
        });
    }

    count(...matchers) {
        return this.challenges.reduce((count, challenge) => {
            if (matchers.some((matcher) => challenge.isMatch(matcher))) {
                return count + 1;
            }

            return count;
        }, 0);
    }
}
