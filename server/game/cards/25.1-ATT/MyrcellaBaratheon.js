const DrawCard = require('../../drawcard.js');

class MyrcellaBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            cost: ability.costs.returnSelfToHand(),
            max: ability.limit.perPhase(1),
            message: {
                format: '{player} returns {source} to their hand to initiate an additional intrigue challenge this phase against {opponent}',
                args: { opponent: (context) => context.event.challenge.loser }
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge(
                        'intrigue',
                        (opponent) => opponent === context.event.challenge.loser
                    )
                }));
            }
        });
    }
}

MyrcellaBaratheon.code = '25005';

module.exports = MyrcellaBaratheon;
