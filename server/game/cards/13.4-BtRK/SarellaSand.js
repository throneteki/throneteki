const DrawCard = require('../../drawcard.js');

class SarellaSand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    this.isParticipating() &&
                    event.challenge.attackingPlayer === this.controller
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to be able to initiate an additional {2} challenge this phase',
                    this.controller,
                    this,
                    context.event.challenge.challengeType
                );
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge(
                        context.event.challenge.challengeType
                    )
                }));
            }
        });
    }
}

SarellaSand.code = '13075';

module.exports = SarellaSand;
