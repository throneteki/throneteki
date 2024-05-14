class ChallengeRestriction {
    constructor(type, opponentCondition = () => true) {
        this.type = type;
        this.opponentCondition = opponentCondition;
    }

    isMatch(type, opponent) {
        return ['any', type].includes(this.type) && this.opponentCondition(opponent);
    }
}

export default ChallengeRestriction;
