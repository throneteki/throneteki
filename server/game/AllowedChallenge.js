class AllowedChallenge {
    constructor(challengeType, opponentFunc = () => true) {
        this.challengeType = challengeType;
        this.opponentFunc = opponentFunc;
        this.used = false;
    }

    isMatch(challengeType, opponent) {
        return !this.used && this.challengeType === challengeType && this.opponentFunc(opponent);
    }
}

module.exports = AllowedChallenge;
