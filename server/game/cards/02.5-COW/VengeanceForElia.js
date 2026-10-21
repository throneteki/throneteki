import DrawCard from '../../drawcard.js';
import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';

class VengeanceForElia extends DrawCard {
    // Vengeance for Elia (02096)
    // Interrupt: When claim is applied for a challenge in which you are the defending player,
    // choose an opponent. That player must satisfy the normal claim effect instead of you as if he
    // or she were the defending player.
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
