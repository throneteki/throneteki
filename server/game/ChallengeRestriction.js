import Restriction from './restriction.js';

class ChallengeRestriction extends Restriction {
    constructor(type, opponentCondition = () => true) {
        super('challenge');
        this.type = type;
        this.opponentCondition = opponentCondition;
    }

    isMatch(type, opponent) {
        return ['any', type].includes(this.type) && this.opponentCondition(opponent);
    }
}

export default ChallengeRestriction;
