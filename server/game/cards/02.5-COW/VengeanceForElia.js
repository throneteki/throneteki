import DrawCard from '../../drawcard.js';
import ApplyClaim from '../../gamesteps/challenge/applyclaim.js';

class VengeanceForElia extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event) => event.challenge.defendingPlayer === this.controller
            },
            chooseOpponent: true,
            handler: (context) => {
                let opponent = context.opponent;

                this.game.addMessage(
                    '{0} uses {1} to apply claim to {2} instead',
                    context.player,
                    this,
                    opponent
                );

                context.replaceHandler(() => {
                    let replacementClaim = context.event.claim.clone();
                    replacementClaim.replaceRecipient(this.controller, opponent);

                    this.game.queueStep(new ApplyClaim(this.game, replacementClaim));
                });
            }
        });
    }
}

VengeanceForElia.code = '02096';

export default VengeanceForElia;
