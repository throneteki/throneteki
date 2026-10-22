import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class UnbowedUnbentUnbroken extends DrawCard {
    // Unbowed, Unbent, Unbroken (01120)
    // Play only if you are not the first player.
    // Reaction: After you lose a challenge as the defending player, name a challenge type. Until
    // the end of the phase, the winner of the challenge cannot initiate challenges of that type.
    // (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    !context.player.firstPlayer &&
                    event.challenge.defendingPlayer === context.player &&
                    event.challenge.loser === context.player
            },
            gameAction: GameActions.chooseChallengeType({
                message: {
                    format: '{player} plays {source} to make {winner} unable to initiate {challengeType} challenges until the end of the phase',
                    args: { winner: (context) => context.event.challenge.winner }
                },
                gameAction: (challengeType) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        targetController: context.event.challenge.winner,
                        effect: ability.effects.cannotInitiateChallengeType(challengeType)
                    }))
            })
        });
    }
}

UnbowedUnbentUnbroken.code = '01120';

export default UnbowedUnbentUnbroken;
