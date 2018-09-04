const DrawCard = require('../../drawcard');

class PrivilegedPosition extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: event => (
                    !this.hasLostPowerChallenge() &&
                    event.ability.isTriggeredAbility() &&
                    ['event', 'location'].includes(event.source.getType()) &&
                    event.source.controller !== this.controller
                )
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to cancel {2}', this.controller, this, context.event.source);
                context.event.cancel();
            }
        });
    }

    hasLostPowerChallenge() {
        let challenges = this.controller.getParticipatedChallenges();
        return challenges.some(challenge => challenge.loser === this.controller && challenge.challengeType === 'power');
    }
}

PrivilegedPosition.code = '11068';

module.exports = PrivilegedPosition;
