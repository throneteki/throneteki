const DrawCard = require('../../../drawcard.js');

class RelentlessAssault extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.attackingPlayer === this.controller &&
                    challenge.strengthDifference >= 5
                )
            },
            cost: ability.costs.kneelFactionCard(),
            handler: context => {
                let type = this.game.currentChallenge.challengeType;
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.modifyChallengeTypeLimit(type, 1)
                }));
                this.game.addMessage('{0} uses {1} to be able to initate an additional {2} challenge this phase', context.player, this, type);
            }
        });
    }
}

RelentlessAssault.code = '04118';

module.exports = RelentlessAssault;
