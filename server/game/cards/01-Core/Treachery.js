import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Treachery extends DrawCard {
    // Treachery (01102)
    // Play only if you control a unique [lannister] character.
    // Interrupt: When the effects of a triggered character, location, or attachment ability would
    // initiate, cancel those effects.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                //Restrict triggering on own triggered abilities to forced triggered abilities
                onCardAbilityInitiated: (event, context) =>
                    context.source.controller.anyCardsInPlay(
                        (card) =>
                            card.isUnique() &&
                            card.isFaction('lannister') &&
                            card.getType() === 'character'
                    ) &&
                    event.ability.isTriggeredAbility() &&
                    ['character', 'location', 'attachment'].includes(event.source.getType()) &&
                    (event.ability.isForcedAbility() || event.player !== context.source.controller)
            },
            message: {
                format: '{player} plays {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

Treachery.code = '01102';

export default Treachery;
