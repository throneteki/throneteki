import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class CoordinatedAttack extends PlotCard {
    // Coordinated Attack (12049)
    // Reaction: After you win a challenge as the attacking player, choose a different challenge
    // type. You may initiate an additional challenge of the chosen type this phase. (Limit once per
    // phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.attackingPlayer === context.player
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.chooseChallengeType({
                exclude: (context) => context.event.challenge.challengeType,
                message:
                    '{player} uses {source} to be able to initiate an additional {challengeType} challenge this phase',
                gameAction: (challengeType) =>
                    GameActions.lastingEffect(() => ({
                        duration: 'untilEndOfPhase',
                        targetController: 'current',
                        effect: ability.effects.mayInitiateAdditionalChallenge(challengeType)
                    }))
            })
        });
    }
}

CoordinatedAttack.code = '12049';

export default CoordinatedAttack;
