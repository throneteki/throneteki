import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Yronwood extends DrawCard {
    // Yronwood (26008)
    // Interrupt: When the effects of an opponent's reaction to winning a challenge would initiate,
    // kneel Yronwood to cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.eventType === 'reaction' &&
                    event.ability.triggersFor('afterChallenge') &&
                    event.player !== context.source.controller
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to cancel {card}',
                args: { card: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

Yronwood.code = '26008';

export default Yronwood;
