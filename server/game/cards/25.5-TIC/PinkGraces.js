import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';

class PinkGraces extends DrawCard {
    setupCardAbilities() {
        this.tracker = GenericTracker.forPhase(this.game, 'onClaimApplied');

        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            message:
                '{player} uses {source} to allow each player who did not apply military claim this phase to draw 1 card',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getPlayersInFirstPlayerOrder()
                    .filter((player) => !this.hasAppliedMilitaryClaim(player))
                    .map((player) =>
                        GameActions.may({
                            player,
                            title: 'Draw 1 card from ' + this.name + '?',
                            message: {
                                format: '{choosingPlayer} {gameAction}',
                                args: { choosingPlayer: () => player }
                            },
                            gameAction: GameActions.drawCards({ player, amount: 1, source: this })
                        })
                    )
            )
        });
    }

    hasAppliedMilitaryClaim(player) {
        return this.tracker.some(
            (event) => event.player === player && event.claim.challengeType === 'military'
        );
    }
}

PinkGraces.code = '25093';

export default PinkGraces;
