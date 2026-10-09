import DrawCard from '../../drawcard.js';

class SomeoneAlwaysTells extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            cost: ability.costs.kneelFactionCard(),
            when: {
                onCardAbilityInitiated: (event) =>
                    event.source.controller !== this.controller &&
                    (event.source.getType() === 'event' ||
                        (event.source.getType() === 'plot' &&
                            event.ability.isWhenRevealedAbility()))
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

SomeoneAlwaysTells.code = '17168';

export default SomeoneAlwaysTells;
