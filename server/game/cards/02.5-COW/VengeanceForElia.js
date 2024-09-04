import DrawCard from '../../drawcard.js';
import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';

class VengeanceForElia extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge && event.challenge.defendingPlayer === this.controller
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

                context.replaceHandler((event) => {
                    event.claim.replaceRecipient(this.controller, opponent);

                    this.game.queueStep(new SatisfyClaim(this.game, event.claim));
                });
            }
        });
    }
}

VengeanceForElia.code = '02096';

export default VengeanceForElia;
