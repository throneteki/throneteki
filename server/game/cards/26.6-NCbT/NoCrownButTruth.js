import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NoCrownButTruth extends DrawCard {
    // No Crown but Truth (26102)
    // Interrupt: When the effects of an opponent's triggered character ability would initiate, kill
    // a Maester character to cancel those effects and draw 1 card.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    (event.ability.isForcedAbility() || event.source.controller !== context.player)
            },
            cost: ability.costs.kill((card) => card.hasTrait('maester')),
            message: {
                format: '{player} uses {source} and kills {costs.kill} to cancel {card} and draw 1 card',
                args: { card: (context) => context.event.source }
            },
            gameAction: GameActions.simultaneously([
                GameActions.cancelEffects((context) => ({ event: context.event })),
                GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

NoCrownButTruth.code = '26102';

export default NoCrownButTruth;
