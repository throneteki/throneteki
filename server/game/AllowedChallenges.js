import AllowedChallenge from './AllowedChallenge.js';

class AllowedChallenges {
    constructor(player) {
        this.player = player;
        this.allowedChallenges = [
            new AllowedChallenge('military'),
            new AllowedChallenge('intrigue'),
            new AllowedChallenge('power')
        ];
        this.restrictions = [];

        this.reset();
    }

    get numInitiated() {
        return this.allowedChallenges.reduce((count, allowance) => {
            if (allowance.used) {
                return count + 1;
            }

            return count;
        }, 0);
    }

    track(challenge) {
        if (challenge.attackingPlayer === this.player) {
            this.useAllowedChallenge(challenge);
        }
    }

    useAllowedChallenge(challenge) {
        let allowedChallenge = this.allowedChallenges.find((allowedChallenge) =>
            allowedChallenge.isMatch(challenge.initiatedChallengeType, challenge.defendingPlayer)
        );
        if (allowedChallenge) {
            allowedChallenge.markUsed(challenge);
        }
    }

    untrack(challenge) {
        let allowedChallenge = this.allowedChallenges.find(
            (allowedChallenge) => allowedChallenge.challenge === challenge && allowedChallenge.used
        );
        if (allowedChallenge) {
            allowedChallenge.resetUsage();
        }
    }

    reset() {
        for (let allowedChallenge of this.allowedChallenges) {
            allowedChallenge.resetUsage();
        }
    }

    canInitiate(challengeType, opponent) {
        if (!!this.maxTotal && this.numInitiated >= this.maxTotal) {
            return false;
        }

        if (this.restrictions.some((restriction) => restriction.isMatch(challengeType, opponent))) {
            return false;
        }

        return this.allowedChallenges.some((allowedChallenge) =>
            allowedChallenge.isMatch(challengeType, opponent)
        );
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
        this.restrictions = this.restrictions.filter((r) => r !== restriction);
    }

    addAllowedChallenge(allowedChallenge) {
        this.allowedChallenges.push(allowedChallenge);
    }

    removeAllowedChallenge(allowedChallenge) {
        let index = this.allowedChallenges.findIndex((a) => a === allowedChallenge);
        if (index !== -1) {
            this.allowedChallenges.splice(index, 1);
        }
    }
}

export default AllowedChallenges;
