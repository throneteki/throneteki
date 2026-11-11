import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RedMountains extends DrawCard {
    // Red Mountains (25088)
    // Challenges Action: Kneel and sacrifice Red Mountains to choose an opponent. That player must
    // initiate a [military] challenge against you as their next challenge this phase, if able.
    // +1 Initiative.
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });

        this.action({
            title: 'Force military challenge',
            phase: 'challenge',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            chooseOpponent: true,
            message: {
                format: '{player} kneels and sacrifices {source} to force {opponent} to initiate their next challenge as a {challengeType} challenge against {player}, if able',
                args: { challengeType: () => 'military' }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'custom',
                until: {
                    onChallengeInitiated: (event) =>
                        event.challenge.isMatch({ initiatingPlayer: context.opponent }),
                    onPhaseEnded: () => true
                },
                match: context.opponent,
                effect: ability.effects.mustInitiateNextChallenge(
                    'military',
                    (player) => player === context.player
                )
            }))
        });
    }
}

RedMountains.code = '25088';

export default RedMountains;
