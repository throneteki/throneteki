const DrawCard = require('../../drawcard.js');

class BloodyArakh extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Dothraki' });
        this.reaction({
            max: ability.limit.perPhase(1),
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.challengeType === 'military' &&
                                         event.challenge.isAttacking(this.parent)
            },
            handler: context => {
                context.player.sacrificeCard(this);

                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    effect: ability.effects.modifyChallengeTypeLimit('military', 1)
                }));

                this.game.addMessage('{0} sacrifices {1} and can initiate an additional {2} challenge this phase',
                    context.player, this, 'military');
            }
        });
    }
}

BloodyArakh.code = '08015';

module.exports = BloodyArakh;
