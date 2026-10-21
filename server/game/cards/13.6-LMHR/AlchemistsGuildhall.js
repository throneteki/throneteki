import DrawCard from '../../drawcard.js';

class AlchemistsGuildhall extends DrawCard {
    // Alchemists' Guildhall (13110)
    // Shadow (2).
    // Interrupt: When the effects of a triggered character ability would initiate, if that
    // character does not have shadow, kneel and return Alchemists' Guildhall to shadows to cancel
    // those effects. (Max 1 per phase.)
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
