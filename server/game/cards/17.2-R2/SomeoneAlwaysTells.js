import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SomeoneAlwaysTells extends DrawCard {
    // Someone Always Tells (17168)
    // Interrupt: When the effects of an opponent's event or when revealed ability would initiate,
    // cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            cost: ability.costs.kneelFactionCard(),
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.player !== context.source.controller &&
                    (event.source.getType() === 'event' ||
                        (event.source.getType() === 'plot' &&
                            event.ability.isWhenRevealedAbility()))
            },
            message: {
                format: '{player} plays {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

SomeoneAlwaysTells.code = '17168';

export default SomeoneAlwaysTells;
