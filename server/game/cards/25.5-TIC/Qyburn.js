import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Qyburn extends DrawCard {
    // Qyburn (25085)
    // Shadow (3).
    // Reaction: After Qyburn comes out of shadows, choose a non-Army character in an opponent's
    // dead pile and put it into play under your control. At the end of the phase, if that card is
    // still in play, remove it from the game (cannot be saved).
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'dead pile',
                    not: { trait: 'Army' },
                    controller: 'opponent',
                    condition: (card, context) =>
                        GameActions.putIntoPlay({ card, player: context.player }).allow()
                }
            },
            message: '{player} uses {source} to put {target} into play under their control',
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    card: context.target,
                    player: context.player
                })),
                GameActions.delayedEffect((context) => {
                    const card = context.target;
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
                                gameAction: GameActions.removeFromGame({ card, allowSave: false })
                            }
                        })
                    };
                })
            ])
        });
    }
}

Qyburn.code = '25085';

export default Qyburn;
