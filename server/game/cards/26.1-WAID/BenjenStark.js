import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BenjenStark extends DrawCard {
    // Benjen Stark (26009)
    // Renown.
    // Reaction: After you win a [military] challenge in which Benjen Stark is attacking, name a
    // challenge type. Until the end of the phase, the losing opponent cannot initiate challenges of
    // that type against you.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.player,
                        challengeType: 'military'
                    }) && context.source.isAttacking()
            },
            gameAction: GameActions.chooseChallengeType({
                message: {
                    format: '{player} uses {source} to prevent {loser} from initiating {challengeType} challenges against them until the end of the phase',
                    args: { loser: (context) => context.event.challenge.loser }
                },
                gameAction: (challengeType) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        targetController: context.event.challenge.loser,
                        effect: ability.effects.cannotInitiateChallengeType(
                            challengeType,
                            (opponent) => opponent === context.player
                        )
                    }))
            })
        });
    }
}

BenjenStark.code = '26009';

export default BenjenStark;
