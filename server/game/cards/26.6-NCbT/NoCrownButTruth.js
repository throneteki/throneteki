import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NoCrownButTruth extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                // Restrict triggering on own character abilities to forced triggered abilities
                onCardAbilityInitiated: (event) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    (event.ability.isForcedAbility() || event.source.controller !== this.controller)
            },
            cost: ability.costs.kill((card) => card.hasTrait('maester')),
            message: {
                format: '{player} uses {source} and kills {costs.kill} to cancel {card} and draw 1 card',
                args: { card: (context) => context.event.source }
            },
            handler: (context) => {
                context.event.cancel();
                this.game.resolveGameAction(
                    GameActions.drawCards((context) => ({ player: context.player, amount: 1 })),
                    context
                );
            }
        });
    }
}

NoCrownButTruth.code = '26102';

export default NoCrownButTruth;
