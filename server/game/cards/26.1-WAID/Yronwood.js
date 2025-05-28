import DrawCard from '../../drawcard.js';

class Yronwood extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.eventType === 'reaction' &&
                    event.ability.triggersFor('afterChallenge') &&
                    event.player !== this.controller
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to cancel {card}',
                args: { card: (context) => context.event.source }
            },
            handler: (context) => {
                context.event.cancel();
            }
        });
    }
}

Yronwood.code = '26008';

export default Yronwood;
