const DrawCard = require('../../drawcard.js');
const ApplyClaim = require('../../gamesteps/challenge/applyclaim.js');

class TempleOfTheGraces extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: event => event.challenge.challengeType === 'military' && event.challenge.attackingPlayer === this.controller
            },
            cost: ability.costs.kneel(card => card.hasTrait('Grace')),
            message: '{player} uses {source} and kneels {costs.kneel} to apply intrigue claim instead of military claim',
            handler: context => {
                context.replaceHandler(() => {
                    let replacementClaim = context.event.claim.clone();
                    replacementClaim.challengeType = 'intrigue';

                    this.game.queueStep(new ApplyClaim(this.game, replacementClaim));
                });
            }
        });
    }
}

TempleOfTheGraces.code = '25580';
TempleOfTheGraces.version = '1.0';

module.exports = TempleOfTheGraces;
