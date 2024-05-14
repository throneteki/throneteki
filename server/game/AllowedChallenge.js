class AllowedChallenge {
    constructor(challengeType, opponentFunc = () => true) {
        this.challengeType = challengeType;
        this.opponentFunc = opponentFunc;
        this.used = false;
    }

    markUsed(challenge) {
        this.challenge = challenge;
        this.used = true;
    }

    resetUsage() {
        this.challenge = null;
        this.used = false;
    }

    isMatch(challengeType, opponent) {
        return !this.used && this.challengeType === challengeType && this.opponentFunc(opponent);
    }
}

export default AllowedChallenge;
