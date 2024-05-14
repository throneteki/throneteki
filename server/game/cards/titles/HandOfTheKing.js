const TitleCard = require('../../TitleCard');
const { ChallengeTracker } = require('../../EventTrackers');

class HandOfTheKing extends TitleCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.supports('Master of Laws');
        this.rivals('Master of Coin', 'Master of Ships');
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('power', (opponent) =>
                this.allowOpponent(opponent)
            )
        });
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.game.currentChallenge.anyParticipants(
                    (card) => card.controller === this.controller
                ),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
    }

    allowOpponent(opponent) {
        let opponents = this.powerChallengeOpponents();

        if (opponents.size === 0) {
            return false;
        }

        if (opponents.size === 1) {
            return !opponents.has(opponent);
        }

        return true;
    }

    powerChallengeOpponents() {
        let powerChallenges = this.tracker.filter({
            attackingPlayer: this.controller,
            challengeType: 'power'
        });

        return new Set(powerChallenges.map((challenge) => challenge.defendingPlayer));
    }
}

HandOfTheKing.code = '01208';

module.exports = HandOfTheKing;
