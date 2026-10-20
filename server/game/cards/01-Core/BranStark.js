import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BranStark extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.source.getType() === 'event' && event.player !== this.controller
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
