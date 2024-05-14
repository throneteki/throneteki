const PlotCard = require('../../plotcard');
const ApplyClaim = require('../../gamesteps/challenge/applyclaim');

class TheHandsTourney extends PlotCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onClaimApplied: (event) => event.challenge.challengeType === 'military'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} is forced by {1} to apply {2} claim instead of {3} claim',
                    context.event.challenge.attackingPlayer,
                    this,
                    'power',
                    'military'
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

TheHandsTourney.code = '14051';

module.exports = TheHandsTourney;
