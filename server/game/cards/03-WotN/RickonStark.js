import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RickonStark extends DrawCard {
    // Rickon Stark (03016)
    // Interrupt: When the effects of a triggered ability with the word "search" in it would
    // initiate, sacrifice Rickon Stark to cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.isTriggeredAbility() && event.source.hasText('search')
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

RickonStark.code = '03016';

export default RickonStark;
