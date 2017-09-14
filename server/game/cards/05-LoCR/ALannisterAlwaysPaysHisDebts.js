const DrawCard = require('../../drawcard.js');

class ALannisterAlwaysPaysHisDebts extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            max: ability.limit.perPhase(1),
            title: 'Raise challenge limit',
            chooseOpponent: opponent => this.hasLostChallengeAgainst(opponent),
            phase: 'challenge',
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: [
                        ability.effects.modifyChallengeTypeLimit('military', 1),
                        ability.effects.modifyChallengeTypeLimit('intrigue', 1)
                    ]
                }));

                this.game.addMessage('{0} plays {1} to be able to initiate an additional {2} and {3} challenge this phase',
                    this.controller, this, 'military', 'intrigue');
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
