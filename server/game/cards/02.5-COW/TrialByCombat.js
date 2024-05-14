import DrawCard from '../../drawcard.js';
import ApplyClaim from '../../gamesteps/challenge/applyclaim.js';

class TrialByCombat extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge.winner === this.controller &&
                    // While valid for anyone to play, typically only the attacking player
                    // or other Melee players will want to trigger it.
                    event.challenge.defendingPlayer !== this.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            handler: (context) => {
                let opponent = context.event.challenge.defendingPlayer;

                this.game.addMessage(
                    '{0} uses {1} to have {2} apply {3} claim instead of {4} claim',
                    this.controller,
                    this,
                    opponent,
                    'military',
                    'intrigue'
                );

                context.replaceHandler(() => {
                    let replacementClaim = context.event.claim.clone();
                    replacementClaim.challengeType = 'military';

                    this.game.queueStep(new ApplyClaim(this.game, replacementClaim));
                });
            }
        });
    }
}

TrialByCombat.code = '02090';

export default TrialByCombat;
