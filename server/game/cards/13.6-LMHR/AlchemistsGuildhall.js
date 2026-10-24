import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
                onCardAbilityInitiated: (event, context) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    (event.ability.isForcedAbility() ||
                        event.source.controller !== context.source.controller) &&
                    !event.source.isShadow()
            },
            cost: [ability.costs.kneelSelf(), ability.costs.putSelfIntoShadows()],
            message: {
                format: '{player} kneels and returns {source} to shadows to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

AlchemistsGuildhall.code = '13110';

export default AlchemistsGuildhall;
