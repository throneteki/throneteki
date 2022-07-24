const DrawCard = require('../../drawcard.js');

class SerVardisEgen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {                
                afterChallenge: event => this.isDefending() && event.challenge.isMatch({ winner: this.controller, challengeType: 'military' })
            },
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to be able to initiate an additional power challenge this phase',
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge('power')
                }));
            }
        });
    }
}

SerVardisEgen.code = '23026';

module.exports = SerVardisEgen;
