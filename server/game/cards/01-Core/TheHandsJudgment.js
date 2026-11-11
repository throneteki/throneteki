import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHandsJudgment extends DrawCard {
    // The Hand's Judgment (01045)
    // Interrupt: When the effects of an opponent's event would initiate, cancel those effects. X is
    // that event's printed cost.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) => {
                    if (
                        event.source.getType() !== 'event' ||
                        event.player === context.source.controller
                    ) {
                        return false;
                    }

                    context.source.eventToInterrupt = event.source;

                    return true;
                }
            },
            message: {
                format: '{player} plays {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }

    getCost() {
        if (!this.eventToInterrupt) {
            return super.getCost();
        }

        return this.translateXValue(this.eventToInterrupt.getPrintedCost());
    }
}

TheHandsJudgment.code = '01045';

export default TheHandsJudgment;
