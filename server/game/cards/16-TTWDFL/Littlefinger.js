const DrawCard = require('../../drawcard');

class Littlefinger extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.source.getType() === 'event' && event.player !== this.controller
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to cancel {event}',
                args: { event: (context) => context.event.source }
            },
            handler: (context) => {
                context.event.cancel();
            }
        });
    }
}

Littlefinger.code = '16017';

module.exports = Littlefinger;
