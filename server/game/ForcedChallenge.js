class ForcedChallenge {
    constructor(challengeType, opponentFunc = () => true) {
        this.challengeType = challengeType;
        this.opponentFunc = opponentFunc;
        this.satisfied = false;
    }

    markSatisfied(challenge) {
        this.challenge = challenge;
        this.satisfied = true;
    }

    resetUsage() {
        this.challenge = null;
        this.satisfied = false;
    }

    isMatch(challengeType, opponent) {
        return (
            !this.satisfied && this.challengeType === challengeType && this.opponentFunc(opponent)
        );
    }
}

export default ForcedChallenge;
