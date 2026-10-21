import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class GriffinsRoostKnight extends DrawCard {
    // Griffin's Roost Knight (14009)
    // Interrupt: When the challenges phase ends, if you have not lost a [power] challenge this
    // phase, stand Griffin's Roost Knight.
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' &&
                    !this.tracker.some({ loser: this.controller, challengeType: 'power' }) &&
                    this.allowGameAction('stand')
            },
            message: '{player} uses {source} to stand {source}',
            handler: () => {
                this.game.resolveGameAction(GameActions.standCard({ card: this }));
            }
        });
    }
}

GriffinsRoostKnight.code = '14009';

export default GriffinsRoostKnight;
