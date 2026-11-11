import AllowedChallenge from './AllowedChallenge.js';
import ChallengeMatcher from './ChallengeMatcher.js';

class AllowedChallenges {
    constructor(player) {
        this.player = player;
        this.allowedChallenges = [
            new AllowedChallenge('military'),
            new AllowedChallenge('intrigue'),
            new AllowedChallenge('power')
        ];
        this.forcedChallenges = [];
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
            this.useChallenge(challenge);
        }
    }

    useChallenge(challenge) {
        const allowedChallenge = this.allowedChallenges.find((allowedChallenge) =>
            allowedChallenge.isMatch(challenge.initiatedChallengeType, challenge.defendingPlayer)
        );
        if (allowedChallenge) {
            allowedChallenge.markUsed(challenge);
        }

        const forcedChallenge = this.forcedChallenges.find((forcedChallenge) =>
            forcedChallenge.isMatch(
                this.player,
                challenge.initiatedChallengeType,
                challenge.defendingPlayer
            )
        );
        if (forcedChallenge) {
            forcedChallenge.markSatisfied(challenge);
        }
    }

    untrack(challenge) {
        const allowedChallenge = this.allowedChallenges.find(
            (allowedChallenge) => allowedChallenge.challenge === challenge && allowedChallenge.used
        );
        if (allowedChallenge) {
            allowedChallenge.resetUsage();
        }

        const forcedChallenge = this.forcedChallenges.find(
            (forcedChallenge) =>
                forcedChallenge.challenge === challenge && forcedChallenge.satisfied
        );
        if (forcedChallenge) {
            forcedChallenge.resetUsage();
        }
    }

    reset() {
        for (const allowedChallenge of this.allowedChallenges) {
            allowedChallenge.resetUsage();
        }
        for (const forcedChallenge of this.forcedChallenges) {
            forcedChallenge.resetUsage();
        }
    }

    mustInitiate(challengeType, opponent) {
        return this.forcedChallenges.some(
            (forcedChallenge) =>
                forcedChallenge.isMatch(challengeType, opponent) &&
                this.canInitiate(forcedChallenge.challengeType, opponent)
        );
    }

    canInitiate(challengeType, opponent, isForced = false) {
        if (this.player.isSupporter(opponent)) {
            return false;
        }

        if (!!this.maxTotal && this.numInitiated >= this.maxTotal) {
            return false;
        }

        if (this.restrictions.some((restriction) => restriction.isMatch(challengeType, opponent))) {
            return false;
        }

        if (!isForced) {
            const forcableChallenges = this.forcedChallenges.filter(
                (forcedChallenge) =>
                    !forcedChallenge.satisfied &&
                    this.player.game
                        .getOpponents(this.player)
                        .some((opponent) =>
                            this.canInitiate(forcedChallenge.challengeType, opponent, true)
                        )
            );

            if (forcableChallenges.length > 0) {
                return forcableChallenges.some((forcedChallenge) =>
                    forcedChallenge.isMatch(challengeType, opponent)
                );
            }
        }

        return this.allowedChallenges.some(
            (allowedChallenge) =>
                allowedChallenge.isMatch(challengeType, opponent) &&
                this.hasCardsToInitiate(allowedChallenge.challengeType, opponent)
        );
    }

    hasCardsToInitiate(challengeType, opponent) {
        const challenge = this.prospectiveChallenge(challengeType, opponent);
        return this.player.anyCardsInPlay((card) =>
            card.canParticipate({
                attacking: true,
                challengeType,
                challenge
            })
        );
    }

    prospectiveChallenge(challengeType, opponent) {
        return {
            attackingPlayer: this.player,
            initiatingPlayer: this.player,
            defendingPlayer: opponent,
            initiatedAgainstPlayer: opponent,
            challengeType,
            initiatedChallengeType: challengeType,
            number: this.numInitiated + 1,
            attackers: [],
            defenders: [],
            isMatch(matchers) {
                return ChallengeMatcher.isMatch(this, matchers);
            }
        };
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
        const index = this.allowedChallenges.findIndex((a) => a === allowedChallenge);
        if (index !== -1) {
            this.allowedChallenges.splice(index, 1);
        }
    }

    addForcedChallenge(forcedChallenge) {
        this.forcedChallenges.push(forcedChallenge);
    }

    removeForcedChallenge(forcedChallenge) {
        const index = this.forcedChallenges.findIndex((a) => a === forcedChallenge);
        if (index !== -1) {
            this.forcedChallenges.splice(index, 1);
        }
    }
}

export default AllowedChallenges;
