import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DrownedGodFanatic extends DrawCard {
    // Drowned God Fanatic (17106)
    // Action: Kill a [greyjoy] character you own and control to put Drowned God Fanatic into play
    // from your dead pile. (Max once per round.)
    // Interrupt: When the effects of an opponent's triggered character ability would initiate,
    // discard Drowned God Fanatic from your hand to cancel those effects.
    setupCardAbilities(ability) {
        this.action({
            max: ability.limit.perRound(1),
            title: 'Put Drowned God Fanatic into play',
            location: 'dead pile',
            cost: ability.costs.kill(
                (card, context) =>
                    card.getType() === 'character' &&
                    card.controller === context.player &&
                    card.owner === context.player &&
                    card.isFaction('greyjoy')
            ),
            message: '{player} kills {costs.kill} to put {source} into play from their dead pile',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    event.player !== context.player
            },
            location: 'hand',
            cost: ability.costs.discardSelfFromHand(),
            message: {
                format: '{player} discards {source} from their hand to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

DrownedGodFanatic.code = '17106';

export default DrownedGodFanatic;
