import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SomeoneAlwaysTells extends DrawCard {
    // Someone Always Tells (08116)
    // Interrupt: When the effects of an opponent's event or triggered plot ability would initiate,
    // cancel those effects.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.player !== context.source.controller &&
                    (event.source.getType() === 'event' ||
                        (event.source.getType() === 'plot' && event.ability.isTriggeredAbility()))
            },
            message: {
                format: '{player} plays {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

SomeoneAlwaysTells.code = '08116';

export default SomeoneAlwaysTells;
