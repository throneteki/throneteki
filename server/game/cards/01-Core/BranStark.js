import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BranStark extends DrawCard {
    // Bran Stark (01142)
    // Interrupt: When the effects of an opponent's event would initiate, sacrifice Bran Stark to
    // cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.source.getType() === 'event' && event.player !== context.player
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to cancel {event}',
                args: { event: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

BranStark.code = '01142';

export default BranStark;
