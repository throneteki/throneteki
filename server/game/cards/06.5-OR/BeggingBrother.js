import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BeggingBrother extends DrawCard {
    // Begging Brother (06097)
    // Bestow (3).
    // Interrupt: When the effects of a triggered character ability would initiate, discard 1 gold
    // from Begging Brother to cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                //Restrict triggering on own character abilities to forced triggered abilities
                onCardAbilityInitiated: (event, context) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    (event.ability.isForcedAbility() || event.player !== context.source.controller)
            },
            cost: ability.costs.discardGold(),
            message: {
                format: '{player} discards 1 gold from {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

BeggingBrother.code = '06097';

export default BeggingBrother;
