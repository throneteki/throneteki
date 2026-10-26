import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GrowingInfluence extends DrawCard {
    // Growing Influence (26116)
    // Interrupt: When the effects of an opponent's triggered character or location ability would
    // initiate, give that player 1 gold from your gold pool to cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.player !== context.source.controller &&
                    ['character', 'location'].includes(event.source.getType()) &&
                    event.ability.isTriggeredAbility()
            },
            cost: ability.costs.giveGold(1, (context) => context.event.player),
            message: {
                format: '{player} plays {source} and gives {opponent} 1 gold to cancel {card}',
                args: {
                    opponent: (context) => context.event.player,
                    card: (context) => context.event.source
                }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

GrowingInfluence.code = '26116';

export default GrowingInfluence;
