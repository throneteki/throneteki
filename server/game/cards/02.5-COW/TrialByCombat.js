const DrawCard = require('../../drawcard.js');
const ApplyClaim = require('../../gamesteps/challenge/applyclaim.js');

class TrialByCombat extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.challengeType === 'intrigue'
                )
            },
            handler: context => {
                let opponent = context.event.challenge.defendingPlayer;

                this.game.addMessage('{0} uses {1} to have {2} apply {3} claim instead of {4} claim', this.controller, this, opponent, 'military', 'intrigue');

                context.replaceHandler(() => {
                    let replacementChallenge = {
                        challengeType: 'military',
                        claim: this.controller.getClaim(),
                        loser: opponent,
                        winner: this.controller
                    };

                    this.game.queueStep(new ApplyClaim(this.game, replacementChallenge));
                });
            }
        });
    }
}

TrialByCombat.code = '02090';

module.exports = TrialByCombat;
