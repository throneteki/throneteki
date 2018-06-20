const DrawCard = require('../../drawcard.js');

class BridgeOfSkulls extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge'
            },
            chooseOpponent: player => !this.hasInitiatedMilitaryChallenge(player),
            handler: context => {
                let opponent = context.opponent;

                opponent.discardAtRandom(1);

                this.game.addMessage('{0} uses {1} to discard 1 card at random from {2}\'s hand',
                    this.controller, this, opponent);
            }
        });
    }

    hasInitiatedMilitaryChallenge(opponent) {
        let challenges = opponent.getParticipatedChallenges();

        return challenges.some(challenge => (
            challenge.challengeType === 'military' &&
            challenge.attackingPlayer === opponent &&
            challenge.defendingPlayer === this.controller
        ));
    }
}

BridgeOfSkulls.code = '05032';

module.exports = BridgeOfSkulls;
