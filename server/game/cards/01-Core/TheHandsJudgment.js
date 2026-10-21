import DrawCard from '../../drawcard.js';

class TheHandsJudgment extends DrawCard {
    // The Hand's Judgment (01045)
    // Interrupt: When the effects of an opponent's event would initiate, cancel those effects. X is
    // that event's printed cost.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) => {
                    if (event.source.getType() !== 'event' || event.player === this.controller) {
                        return false;
                    }

                    this.eventToInterrupt = event.source;

                    return true;
                }
            },
            handler: (context) => {
                context.event.cancel();

                this.game.addMessage(
                    '{0} plays {1} to cancel {2}',
                    this.controller,
                    this,
                    context.event.source
                );
            }
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
