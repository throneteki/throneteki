import DrawCard from '../../drawcard.js';
import ApplyClaim from '../../gamesteps/challenge/applyclaim.js';

class MyaStone extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    ['military', 'intrigue'].includes(event.challenge.challengeType) &&
                    event.challenge.defendingPlayer === this.controller
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to apply {2} claim instead of {3} claim',
                    context.player,
                    this,
                    'power',
                    context.event.challenge.challengeType
                );

                context.replaceHandler(() => {
                    let replacementClaim = context.event.claim.clone();
                    replacementClaim.challengeType = 'power';

                    this.game.queueStep(new ApplyClaim(this.game, replacementClaim));
                });
            }
        });
    }
}

MyaStone.code = '08117';

export default MyaStone;
