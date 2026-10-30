import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';

class PinkGraces extends DrawCard {
    // Pink Graces (25093)
    // Interrupt: When the challenges phase ends, each player who did not apply [military] claim
    // this phase may draw 1 card.
    setupCardAbilities() {
        const tracker = GenericTracker.forPhase(this.game, 'onClaimApplied');

        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            message:
                '{player} uses {source} to allow each player who did not apply military claim this phase to draw 1 card',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getPlayersInFirstPlayerOrder()
                    .filter(
                        (player) =>
                            !tracker.some(
                                (event) =>
                                    event.player === player &&
                                    event.claim.challengeType === 'military'
                            )
                    )
                    .map((player) =>
                        GameActions.may({
                            player,
                            title: `Draw 1 card from ${context.source.name}?`,
                            message: {
                                format: '{choosingPlayer} {gameAction}',
                                args: { choosingPlayer: () => player }
                            },
                            gameAction: GameActions.drawCards({
                                player,
                                amount: 1,
                                source: context.source
                            })
                        })
                    )
            )
        });
    }
}

PinkGraces.code = '25093';

export default PinkGraces;
