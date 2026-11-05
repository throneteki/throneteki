import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheRedKeep extends DrawCard {
    // The Red Keep (15030)
    // Interrupt: When the effects of an opponent's triggered character, location, or attachment
    // ability would initiate, kneel The Red Keep to cancel those effects.
    // +1 Income.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            cost: ability.costs.kneelSelf(),
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.isTriggeredAbility() &&
                    ['character', 'location', 'attachment'].includes(event.source.getType()) &&
                    event.player !== context.source.controller
            },
            message: {
                format: '{player} kneels {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

TheRedKeep.code = '15030';

export default TheRedKeep;
