import DrawCard from '../../drawcard.js';
import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';

class TrialByCombat extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
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

                context.replaceHandler((event) => {
                    event.claim.challengeType = 'military';

                    this.game.queueStep(new SatisfyClaim(this.game, event.claim));
                });
            }
        });
    }
}

TrialByCombat.code = '02090';

export default TrialByCombat;
