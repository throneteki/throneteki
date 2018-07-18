const PlotCard = require('../../plotcard.js');

class ForTheWatch extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.isDuringChallenge({ defendingPlayer: this.controller }) &&
                this.numOfChallengesInitiatedAgainst() <= 1
            ),
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.cannotWinChallenge()
        });
    }

    numOfChallengesInitiatedAgainst() {
        let challenges = this.controller.getParticipatedChallenges();
        return challenges.reduce((sum, challenge) => {
            if(challenge.defendingPlayer === this.controller) {
                return sum + 1;
            }

            return sum;
        }, 0);
    }
}

ForTheWatch.code = '02067';

module.exports = ForTheWatch;
