const DrawCard = require('../../drawcard.js');
const ApplyClaim = require('../../gamesteps/challenge/applyclaim.js');

class VengeanceForElia extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: event => event.challenge.defendingPlayer === this.controller
            },
            chooseOpponent: true,
            handler: context => {
                let opponent = context.opponent;

                this.game.addMessage('{0} uses {1} to apply claim to {2} instead', context.player, this, opponent);

                context.replaceHandler(() => {
                    let challenge = context.event.challenge;
                    let replacementChallenge = {
                        challengeType: challenge.challengeType,
                        claim: challenge.claim,
                        loser: opponent,
                        winner: challenge.winner,
                        claimRecipients: challenge.claimRecipients.filter(p => p !== this.controller).concat([opponent])
                    };

                    this.game.queueStep(new ApplyClaim(this.game, replacementChallenge));
                });
            }
        });
    }
}

VengeanceForElia.code = '02096';

module.exports = VengeanceForElia;
