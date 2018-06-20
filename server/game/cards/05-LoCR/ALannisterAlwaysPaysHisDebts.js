const DrawCard = require('../../drawcard.js');

class ALannisterAlwaysPaysHisDebts extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            max: ability.limit.perPhase(1),
            title: 'Raise challenge limit',
            chooseOpponent: opponent => this.hasLostChallengeAgainst(opponent),
            phase: 'challenge',
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: [
                        ability.effects.mayInitiateAdditionalChallenge('military', opponent => opponent === context.opponent),
                        ability.effects.mayInitiateAdditionalChallenge('intrigue', opponent => opponent === context.opponent)
                    ]
                }));

                this.game.addMessage('{0} plays {1} to be able to initiate an additional {2} and {3} challenge against {4} this phase',
                    this.controller, this, 'military', 'intrigue', context.opponent);
            }
        });
    }

    hasLostChallengeAgainst(opponent) {
        let challenges = this.controller.getParticipatedChallenges();
        return challenges.some(challenge => challenge.winner === opponent);
    }
}

ALannisterAlwaysPaysHisDebts.code = '05022';

module.exports = ALannisterAlwaysPaysHisDebts;
