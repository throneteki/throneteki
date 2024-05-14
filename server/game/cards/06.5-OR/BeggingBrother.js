import DrawCard from '../../drawcard.js';

class BeggingBrother extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                //Restrict triggering on own character abilities to forced triggered abilities
                onCardAbilityInitiated: (event) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    (event.ability.isForcedAbility() || event.source.controller !== this.controller)
            },
            cost: ability.costs.discardGold(),
            handler: (context) => {
                context.event.cancel();
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to cancel {2}',
                    this.controller,
                    this,
                    context.event.source
                );
            }
        });
    }
}

BeggingBrother.code = '06097';

export default BeggingBrother;
