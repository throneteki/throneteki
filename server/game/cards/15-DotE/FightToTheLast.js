import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FightToTheLast extends DrawCard {
    // Fight to the Last (15036)
    // Interrupt: When a character you control would be killed, save it, stand it, and set its STR
    // to 1 until the end of the phase. At the end of the phase, if that character is still in play,
    // kill it (cannot be saved).
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    (event.allowSave || event.isBurn) &&
                    event.card.canBeSaved() &&
                    event.card.controller === context.player
            },
            location: 'hand',
            message: {
                format: "{player} plays {source} to save, stand and set {card}'s STR to 1 until the end of the phase",
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.event.card,
                    effect: ability.effects.setStrength(1)
                })),
                GameActions.saveCard((context) => ({ event: context.event, remediesBurn: true })),
                GameActions.standCard((context) => ({ card: context.event.card })),
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
                                gameAction: GameActions.kill({ card, allowSave: false })
                            }
                        })
                    };
                })
            ])
        });
    }
}

FightToTheLast.code = '15036';

export default FightToTheLast;
