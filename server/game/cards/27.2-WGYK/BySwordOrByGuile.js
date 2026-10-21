import DrawCard from '../../drawcard.js';
import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';

class BySwordOrByGuile extends DrawCard {
    // By Sword or By Guile (27034)
    // Interrupt: When claim is applied for a [military] or [intrigue] challenge in which you
    // control an attacking Army or Dragon character, apply [power] claim instead.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.isMatch({
                        attackingPlayer: this.controller,
                        challengeType: ['military', 'intrigue']
                    }) &&
                    event.challenge.attackers.some(
                        (card) => card.hasTrait('Army') || card.hasTrait('Dragon')
                    )
            },
            message: '{player} plays {source} to apply power claim instead',
            handler: (context) => {
                context.replaceHandler((event) => {
                    event.claim.challengeType = 'power';

                    this.game.queueStep(new SatisfyClaim(this.game, event.claim));
                });
            }
        });
    }
}

BySwordOrByGuile.code = '27034';

export default BySwordOrByGuile;
