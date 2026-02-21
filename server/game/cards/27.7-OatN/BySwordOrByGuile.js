import DrawCard from '../../drawcard.js';
import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';

class BySwordOrByGuile extends DrawCard {
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

BySwordOrByGuile.code = '27583';
BySwordOrByGuile.version = '1.0.0';

export default BySwordOrByGuile;
