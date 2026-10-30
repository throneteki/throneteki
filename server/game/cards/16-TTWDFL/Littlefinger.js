import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Littlefinger extends DrawCard {
    // Littlefinger (16017)
    // Stealth.
    // Littlefinger does not kneel when declared as an attacker.
    // Interrupt: When the effects of an event would initiate, kneel Littlefinger to cancel those
    // effects.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.source.getType() === 'event' && event.player !== context.source.controller
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to cancel {event}',
                args: { event: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

Littlefinger.code = '16017';

export default Littlefinger;
