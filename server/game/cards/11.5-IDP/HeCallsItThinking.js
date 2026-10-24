import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HeCallsItThinking extends DrawCard {
    // He Calls It Thinking (11096)
    // Interrupt: When the effects of an opponent's non-agenda, non-plot triggered ability would
    // initiate, cancel those effects unless that player pays 1 gold.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.source.controller !== context.player &&
                    !['agenda', 'plot'].includes(event.source.getType()) &&
                    event.ability.isTriggeredAbility()
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.event.source.controller.gold >= 1,
                thenAction: GameActions.choose({
                    player: (context) => context.event.source.controller,
                    title: 'Pay 1 gold to prevent "He Calls It Thinking"',
                    choices: {
                        Yes: {
                            message: {
                                format: '{player} plays {source} to try to cancel {eventSource}, but {choosingPlayer} pays 1 gold to prevent the cancel',
                                args: { eventSource: (context) => context.event.source }
                            },
                            gameAction: GameActions.returnGoldToTreasury((context) => ({
                                player: context.event.source.controller,
                                amount: 1
                            }))
                        },
                        No: cancelEffects()
                    }
                }),
                elseAction: cancelEffects()
            })
        });
    }
}

function cancelEffects() {
    return {
        message: {
            format: '{player} plays {source} to cancel {eventSource}',
            args: { eventSource: (context) => context.event.source }
        },
        gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
    };
}

HeCallsItThinking.code = '11096';

export default HeCallsItThinking;
