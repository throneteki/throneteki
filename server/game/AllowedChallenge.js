class AllowedChallenge {
    constructor(challengeType, opponentFunc = () => true) {
        this.challengeType = challengeType;
        this.opponentFunc = opponentFunc;
    }

    isMatch(challengeType, opponent) {
        return this.challengeType === challengeType && this.opponentFunc(opponent);
    }
}

module.exports = AllowedChallenge;
