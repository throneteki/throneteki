import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheWhiteShadows extends PlotCard {
    // The White Shadows (07050)
    // Reaction: After a character an opponent controls is killed, put it into play under your
    // control. While that character is in play, treat its printed text box as if it were blank. At
    // the end of the phase, if that card is still in play, place it in its owner's dead pile
    // (cannot be saved).
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    context.source.controller !== event.cardStateWhenKilled.controller
            },
            message: {
                format: '{player} uses {source} to put {card} into play under their control, blank',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.event.card
                })),
                GameActions.simultaneously([
                    GameActions.lastingEffect((context) => ({
                        duration: 'custom',
                        until: { onCardLeftPlay: (event) => event.card === context.event.card },
                        match: context.event.card,
                        condition: () =>
                            ['play area', 'duplicate'].includes(context.event.card.location),
                        targetLocation: 'any',
                        effect: [ability.effects.fullBlank]
                    })),
                    GameActions.delayedEffect((context) => {
                        const card = context.event.card;
                        return {
                            duration: 'untilTriggered',
                            title: card.name,
                            when: { onAtEndOfPhase: () => true },
                            until: { onCardLeftPlay: (event) => event.card === card },
                            gameAction: GameActions.ifCondition({
                                condition: () => ['play area', 'duplicate'].includes(card.location),
                                thenAction: {
                                    message:
                                        '{player} resolves the delayed effect from {source}: {gameAction}',
                                    gameAction: GameActions.placeInDeadPile({ card })
                                }
                            })
                        };
                    })
                ])
            ])
        });
    }
}

TheWhiteShadows.code = '07050';

export default TheWhiteShadows;
