const DrawCard = require('../../../drawcard.js');
const ApplyClaim = require('../../../gamesteps/challenge/applyclaim.js');

class TrialByCombat extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.attackingPlayer === this.controller &&
                    challenge.challengeType === 'intrigue'
                )
            },
            handler: context => {
                let opponent = this.game.getOtherPlayer(this.controller);

                context.skipHandler();

                this.game.addMessage('{0} uses {1} to have {2} apply {3} claim instead of {4} claim', this.controller, this, opponent, 'military', 'intrigue');

                let replacementChallenge = {
                    challengeType: 'military',
                    claim: this.controller.getClaim(),
                    loser: opponent,
                    winner: this.controller
                };

                this.game.queueStep(new ApplyClaim(this.game, replacementChallenge));
            }            
        });
    }
}

TrialByCombat.code = '02090';

module.exports = TrialByCombat;
