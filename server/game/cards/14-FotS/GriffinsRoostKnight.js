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
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' &&
                    !context.source.tracker.some({
                        loser: context.source.controller,
                        challengeType: 'power'
                    }) &&
                    context.source.allowGameAction('stand')
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

GriffinsRoostKnight.code = '14009';

export default GriffinsRoostKnight;
