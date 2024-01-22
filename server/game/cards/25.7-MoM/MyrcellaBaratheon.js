const DrawCard = require('../../drawcard.js');

class MyrcellaBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.winner === this.controller &&
                    this.isParticipating()
                )
            },
            cost: ability.costs.returnSelfToHand(),
            max: ability.limit.perPhase(1),
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge('intrigue', opponent => opponent === context.event.challenge.loser)

                }));
                this.game.addMessage('{0} uses {1} to be able to initiate an additional intrigue challenge this phase against {2} ', context.player, this, this.game.currentChallenge.loser);
            }
        });
    }
}

MyrcellaBaratheon.code = '25528';
MyrcellaBaratheon.version = '1.1';

module.exports = MyrcellaBaratheon;
