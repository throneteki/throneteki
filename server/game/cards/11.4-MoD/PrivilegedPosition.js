import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class PrivilegedPosition extends DrawCard {
    // Privileged Position (11068)
    // Play only if you have not lost a [power] challenge this round.
    // Interrupt: When the effects of an opponent's event or triggered location ability would
    // initiate, cancel those effects.
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    !context.source.hasLostPowerChallenge() &&
                    event.ability.isTriggeredAbility() &&
                    ['event', 'location'].includes(event.source.getType()) &&
                    event.source.controller !== context.source.controller
            },
            message: {
                format: '{player} plays {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }

    hasLostPowerChallenge() {
        return this.tracker.some({ loser: this.controller, challengeType: 'power' });
    }
}

PrivilegedPosition.code = '11068';

export default PrivilegedPosition;
