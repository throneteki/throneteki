import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WordsAreWind extends DrawCard {
    // Words Are Wind (09044)
    // Interrupt: When the effects of an opponent's event would initiate, that opponent must choose,
    // either: cancel those effects, or you draw 2 cards.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.source.getType() === 'event' && event.player !== context.player
            },
            message: {
                format: '{player} plays {source} to have {opponent} choose whether to cancel {event} or have {player} draw 2 cards',
                args: {
                    opponent: (context) => context.event.player,
                    event: (context) => context.event.source
                }
            },
            gameAction: GameActions.choose({
                player: (context) => context.event.player,
                title: (context) =>
                    `Cancel ${context.event.source.name} or ${context.player.name} draws 2 cards?`,
                choices: (context) => ({
                    [`Cancel ${context.event.source.name}`]: {
                        message: '{choosingPlayer} chooses to cancel their event for {source}',
                        gameAction: GameActions.cancelEffects((context) => ({
                            event: context.event
                        }))
                    },
                    [`${context.player.name} draws 2 cards`]: {
                        message:
                            '{choosingPlayer} chooses to have {player} draw 2 cards for {source}',
                        gameAction: GameActions.drawCards((context) => ({
                            player: context.player,
                            amount: 2
                        }))
                    }
                })
            })
        });
    }
}

WordsAreWind.code = '09044';

export default WordsAreWind;
