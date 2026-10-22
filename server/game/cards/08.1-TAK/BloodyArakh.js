import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'military' &&
                    event.challenge.isAttacking(context.source.parent)
            },
            message:
                '{player} sacrifices {source} and can initiate an additional military challenge this phase',
            gameAction: GameActions.simultaneously([
                GameActions.sacrificeCard((context) => ({ card: context.source })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    effect: ability.effects.mayInitiateAdditionalChallenge('military')
                }))
            ])
        });
    }
}

BloodyArakh.code = '08015';

export default BloodyArakh;
