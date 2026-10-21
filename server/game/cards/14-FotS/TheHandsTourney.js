import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';
import PlotCard from '../../plotcard.js';

class TheHandsTourney extends PlotCard {
    // The Hand's Tourney (14051)
    // Forced Interrupt: When claim is applied for a [military] challenge, apply [power] claim
    // instead.
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge && event.challenge.challengeType === 'military'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} is forced by {1} to apply {2} claim instead of {3} claim',
                    context.event.challenge.attackingPlayer,
                    this,
                    'power',
                    'military'
                );

                context.replaceHandler((event) => {
                    event.claim.challengeType = 'power';

                    this.game.queueStep(new SatisfyClaim(this.game, event.claim));
                });
            }
        });
    }
}

TheHandsTourney.code = '14051';

export default TheHandsTourney;
