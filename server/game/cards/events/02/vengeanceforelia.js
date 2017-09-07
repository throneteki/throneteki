const DrawCard = require('../../../drawcard.js');
const ApplyClaim = require('../../../gamesteps/challenge/applyclaim.js');

class VengeanceForElia extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: event => event.challenge.defendingPlayer === this.controller
            },
            chooseOpponent: true,
            handler: context => {
                let opponent = context.opponent;

                context.skipHandler();

                this.game.addMessage('{0} uses {1} to apply claim to {2} instead', context.player, this, opponent);

                let replacementChallenge = {
                    challengeType: this.game.currentChallenge.challengeType,
                    claim: this.game.currentChallenge.claim,
                    loser: opponent,
                    winner: this.game.currentChallenge.winner
                };

                this.game.queueStep(new ApplyClaim(this.game, replacementChallenge));
            }
        });
    }
}

VengeanceForElia.code = '02096';

module.exports = VengeanceForElia;
