import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class PrivilegedPosition extends DrawCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    !this.hasLostPowerChallenge() &&
                    event.ability.isTriggeredAbility() &&
                    ['event', 'location'].includes(event.source.getType()) &&
                    event.source.controller !== this.controller
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} to cancel {2}',
                    this.controller,
                    this,
                    context.event.source
                );
                context.event.cancel();
            }
        });
    }

    hasLostPowerChallenge() {
        return this.tracker.some({ loser: this.controller, challengeType: 'power' });
    }
}

PrivilegedPosition.code = '11068';

export default PrivilegedPosition;
