import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WarlockOfQarth extends DrawCard {
    // Warlock of Qarth (22020)
    // Reaction: After a character enters an opponent's dead pile, sacrifice Warlock of Qarth to put
    // that character into play under your control. Until the end of the phase, that character gains
    // insight. At the end of the phase, if that card is still in play, place it in its owner's dead
    // pile (cannot be saved).
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.card.owner !== context.source.controller &&
                    event.card.location === 'dead pile' &&
                    context.source.controller.canPutIntoPlay(event.card)
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to put {card} into play under their control and have it gain insight until the end of the phase',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.event.card
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.event.card,
                    effect: ability.effects.addKeyword('insight')
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
        });
    }
}

WarlockOfQarth.code = '22020';

export default WarlockOfQarth;
