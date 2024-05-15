import DrawCard from '../../drawcard.js';

class SomeoneAlwaysTells extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.source.controller !== this.controller &&
                    (event.source.getType() === 'event' ||
                        (event.source.getType() === 'plot' && event.ability.isTriggeredAbility()))
            },
            handler: (context) => {
                context.event.cancel();
                this.game.addMessage(
                    '{0} plays {1} to cancel {2}',
                    context.player,
                    this,
                    context.event.source
                );
            }
        });
    }
}

SomeoneAlwaysTells.code = '08116';

export default SomeoneAlwaysTells;
