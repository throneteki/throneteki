const _ = require('underscore');

class ChallengeTracker {
    constructor(player) {
        this.player = player;
        this.challengeTypes = {
            military: {
                max: 1
            },
            intrigue: {
                max: 1
            },
            power: {
                max: 1
            }
        };
        this.challenges = [];
        this.restrictions = [];
    }

    track(challenge) {
        this.challenges.push(challenge);
    }

    reset() {
        this.challenges = [];
    }

    getChallenges() {
        return this.challenges;
    }

    canInitiate(challengeType, opponent) {
        if(!_.isUndefined(this.maxTotal) && this.getPerformed() >= this.maxTotal) {
            return false;
        }

        if(this.restrictions.some(restriction => restriction.isMatch(challengeType, opponent))) {
            return false;
        }

        return this.getPerformed(challengeType) < this.challengeTypes[challengeType].max;
    }

    getWon(challengeType) {
        return this.countChallenges(this.challengeTypePredicate(challengeType, 'winner'));
    }

    getLost(challengeType) {
        return this.countChallenges(this.challengeTypePredicate(challengeType, 'loser'));
    }

    challengeTypePredicate(challengeType, property) {
        return challenge => {
            if(challengeType === 'attacker') {
                return challenge.attackingPlayer === this.player && challenge[property] === this.player;
            }

            if(challengeType === 'defender') {
                return challenge.defendingPlayer === this.player && challenge[property] === this.player;
            }

            return challenge.challengeType === challengeType && challenge[property] === this.player;
        };
    }

    getPerformed(challengeType) {
        return this.countChallenges(challenge => {
            if(!challengeType) {
                return challenge.attackingPlayer === this.player;
            }

            return challenge.challengeType === challengeType && challenge.attackingPlayer === this.player;
        });
    }

    setMax(max) {
        this.maxTotal = max;
    }

    clearMax() {
        delete this.maxTotal;
    }

    addRestriction(restriction) {
        this.restrictions.push(restriction);
    }

    removeRestriction(restriction) {
        this.restrictions = this.restrictions.filter(r => r !== restriction);
    }

    modifyMaxForType(challengeType, number) {
        this.challengeTypes[challengeType].max += number;
    }

    countChallenges(predicate) {
        return this.challenges.reduce((sum, challenge) => {
            if(!predicate(challenge)) {
                return sum;
            }

            return sum + 1;
        }, 0);
    }
}

module.exports = ChallengeTracker;
