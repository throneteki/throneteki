import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BurningBright extends DrawCard {
    // Burning Bright (20015)
    // Action: Put an Army or Knight character into play from your discard pile. At the end of the
    // phase, if that card is still in play, discard it from play (cannot be saved).
    setupCardAbilities() {
        this.action({
            title: 'Put character into play',
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    (card.hasTrait('Knight') || card.hasTrait('Army')) &&
                    card.controller === context.player &&
                    'discard pile' === card.location &&
                    context.player.canPutIntoPlay(card)
            },
            message: {
                format: '{player} uses {source} to put {target} into play from their {originalLocation}',
                args: { originalLocation: (context) => context.target.location }
            },
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.target
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
                                gameAction: GameActions.discardCard({ card, allowSave: false })
                            }
                        })
                    };
                })
            ])
        });
    }
}
BurningBright.code = '20015';

export default BurningBright;
