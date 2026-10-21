import DrawCard from '../../drawcard.js';
import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';

class TempleOfTheGraces extends DrawCard {
    // Temple of the Graces (25094)
    // Interrupt: When claim is applied for a [military] challenge in which you are the attacking
    // player, kneel a Grace card to apply [intrigue] claim instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.attackingPlayer === this.controller
            },
            cost: ability.costs.kneel((card) => card.hasTrait('Grace')),
            message:
                '{player} uses {source} and kneels {costs.kneel} to apply intrigue claim instead of military claim',
            handler: (context) => {
                context.replaceHandler((event) => {
                    event.claim.challengeType = 'intrigue';

                    this.game.queueStep(new SatisfyClaim(this.game, event.claim));
                });
            }
        });
    }
}

TempleOfTheGraces.code = '25094';

export default TempleOfTheGraces;
