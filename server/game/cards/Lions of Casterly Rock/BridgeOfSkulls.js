const DrawCard = require('../../drawcard.js');

class BridgeOfSkulls extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge'
            },
            // TODO: For Melee, this should check that they did not initiate a
            // challenge specifically against you, not in general.
            chooseOpponent: player => player.getNumberOfChallengesInitiatedByType('military') < 1,
            handler: context => {
                let opponent = context.opponent;

                opponent.discardAtRandom(1);

                this.game.addMessage('{0} uses {1} to discard 1 card at random from {2}\'s hand',
                    this.controller, this, opponent);
            }
        });
    }
}

BridgeOfSkulls.code = '05032';

module.exports = BridgeOfSkulls;
