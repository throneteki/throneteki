import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SarellaSand extends DrawCard {
    // Sarella Sand (13075)
    // Reaction: After you lose a challenge in which Sarella Sand is attacking, you may initiate an
    // additional challenge of that type this phase. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    context.source.isParticipating() &&
                    event.challenge.attackingPlayer === context.source.controller
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to be able to initiate an additional {challengeType} challenge this phase',
                args: { challengeType: (context) => context.event.challenge.challengeType }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.mayInitiateAdditionalChallenge(
                    context.event.challenge.challengeType
                )
            }))
        });
    }
}

SarellaSand.code = '13075';

export default SarellaSand;
