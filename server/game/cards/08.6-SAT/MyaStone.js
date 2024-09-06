import DrawCard from '../../drawcard.js';
import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';

class MyaStone extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
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

                context.replaceHandler((event) => {
                    event.claim.challengeType = 'power';

                    this.game.queueStep(new SatisfyClaim(this.game, event.claim));
                });
            }
        });
    }
}

MyaStone.code = '08117';

export default MyaStone;
