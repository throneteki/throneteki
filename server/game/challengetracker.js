const AllowedChallenge = require('./AllowedChallenge');

class ChallengeTracker {
    constructor(player) {
        this.player = player;
        this.allowedChallenges = [
            new AllowedChallenge('military'),
            new AllowedChallenge('intrigue'),
            new AllowedChallenge('power')
        ];
        this.challenges = [];
        this.restrictions = [];

        this.reset();
    }

    track(challenge) {
        this.challenges.push(challenge);

        if(challenge.attackingPlayer === this.player) {
            this.useAllowedChallenge(challenge);
        }
    }

    useAllowedChallenge(challenge) {
        let allowedChallenge = this.allowedChallenges.find(allowedChallenge => allowedChallenge.isMatch(challenge.challengeType, challenge.defendingPlayer));
        if(allowedChallenge) {
            allowedChallenge.markUsed(challenge);
        }
    }

    untrack(challenge) {
        this.challenges = this.challenges.filter(c => c !== challenge);

        let allowedChallenge = this.allowedChallenges.find(allowedChallenge => allowedChallenge.challenge === challenge && allowedChallenge.used);
        if(allowedChallenge) {
            allowedChallenge.resetUsage();
        }
    }

    reset() {
        this.challenges = [];
        for(let allowedChallenge of this.allowedChallenges) {
            allowedChallenge.resetUsage();
        }
    }

    getChallenges() {
        return this.challenges;
    }

    canInitiate(challengeType, opponent) {
        if(!!this.maxTotal && this.getPerformed() >= this.maxTotal) {
            return false;
        }

        if(this.restrictions.some(restriction => restriction.isMatch(challengeType, opponent))) {
            return false;
        }

        return this.allowedChallenges.some(allowedChallenge => allowedChallenge.isMatch(challengeType, opponent));
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

    addAllowedChallenge(allowedChallenge) {
        this.allowedChallenges.push(allowedChallenge);
    }

    removeAllowedChallenge(allowedChallenge) {
        let index = this.allowedChallenges.findIndex(a => a === allowedChallenge);
        if(index !== -1) {
            this.allowedChallenges.splice(index, 1);
        }
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
