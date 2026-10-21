import DrawCard from '../../drawcard.js';

class BloodyArakh extends DrawCard {
    // Bloody Arakh (08015)
    // Dothraki character only.
    // Reaction: After you win a [military] challenge in which attached character is attacking,
    // sacrifice Bloody Arakh. Then, you may initiate an additional [military] challenge this phase.
    // (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Dothraki' });
        this.reaction({
            max: ability.limit.perPhase(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.isAttacking(this.parent)
            },
            handler: (context) => {
                context.player.sacrificeCard(this);

                this.untilEndOfPhase((ability) => ({
                    effect: ability.effects.mayInitiateAdditionalChallenge('military')
                }));

                this.game.addMessage(
                    '{0} sacrifices {1} and can initiate an additional {2} challenge this phase',
                    context.player,
                    this,
                    'military'
                );
            }
        });
    }
}

BloodyArakh.code = '08015';

export default BloodyArakh;
