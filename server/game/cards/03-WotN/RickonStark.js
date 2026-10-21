import DrawCard from '../../drawcard.js';

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
            handler: (context) => {
                context.event.cancel();

                this.game.addMessage(
                    '{0} sacrifices {1} to cancel {2}',
                    context.player,
                    this,
                    context.event.source
                );
            }
        });
    }
}

RickonStark.code = '03016';

export default RickonStark;
