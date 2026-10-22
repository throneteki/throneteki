import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterMurenmure extends DrawCard {
    // Maester Murenmure (12010)
    // Interrupt: When the effects of a triggered location ability would initiate, kneel Maester
    // Murenmure to cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.isTriggeredAbility() &&
                    event.source.getType() === 'location' &&
                    // Explicitly allow cancellation of your own forced abilities
                    (event.ability.isForcedAbility() || event.player !== context.source.controller)
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

MaesterMurenmure.code = '12010';

export default MaesterMurenmure;
