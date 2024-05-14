import DrawCard from '../../drawcard.js';

class AlchemistsGuildhall extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            max: ability.limit.perPhase(1),
            when: {
                //Restrict triggering on own character abilities to forced triggered abilities
                onCardAbilityInitiated: (event) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    (event.ability.isForcedAbility() ||
                        event.source.controller !== this.controller) &&
                    !event.source.isShadow()
            },
            cost: [ability.costs.kneelSelf(), ability.costs.putSelfIntoShadows()],
            handler: (context) => {
                context.event.cancel();
                this.game.addMessage(
                    '{0} kneels and returns {1} to shadows to cancel {2}',
                    this.controller,
                    this,
                    context.event.source
                );
            }
        });
    }
}

AlchemistsGuildhall.code = '13110';

export default AlchemistsGuildhall;
