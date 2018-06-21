const TitleCard = require('../../TitleCard.js');

class HandOfTheKing extends TitleCard {
    setupCardAbilities(ability) {
        this.supports('Master of Laws');
        this.rivals('Master of Coin', 'Master of Ships');
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('power', opponent => this.allowOpponent(opponent))
        });
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.game.currentChallenge.anyParticipants(card => card.controller === this.controller)
            ),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.contributeChallengeStrength(1)
        });
    }

    allowOpponent(opponent) {
        let opponents = this.powerChallengeOpponents();

        if(opponents.size === 0) {
            return false;
        }

        if(opponents.size === 1) {
            return !opponents.has(opponent);
        }

        return true;
    }

    powerChallengeOpponents() {
        let challenges = this.controller.getParticipatedChallenges();
        let powerChallenges = challenges.filter(challenge => challenge.attackingPlayer === this.controller && challenge.challengeType === 'power');

        return new Set(powerChallenges.map(challenge => challenge.defendingPlayer));
    }
}

HandOfTheKing.code = '01208';

module.exports = HandOfTheKing;
