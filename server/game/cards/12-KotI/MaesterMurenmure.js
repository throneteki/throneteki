const DrawCard = require('../../drawcard');

class MaesterMurenmure extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.isTriggeredAbility() &&
                    event.source.getType() === 'location' &&
                    // Explicitly allow cancellation of your own forced abilities
                    (event.ability.isForcedAbility() || event.player !== this.controller)
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to cancel {2}',
                    this.controller,
                    this,
                    context.event.source
                );
                context.event.cancel();
            }
        });
    }
}

MaesterMurenmure.code = '12010';

module.exports = MaesterMurenmure;
