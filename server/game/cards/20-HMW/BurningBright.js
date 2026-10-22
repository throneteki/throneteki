import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BurningBright extends DrawCard {
    // Burning Bright (20015)
    // Action: Put an Army or Knight character into play from your discard pile. At the end of the
    // phase, if that card is still in play, discard it from play (cannot be saved).
    setupCardAbilities(ability) {
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
                GameActions.lastingEffect((context) => ({
                    duration: 'atEndOfPhase',
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay(false)
                }))
            ])
        });
    }
}
BurningBright.code = '20015';

export default BurningBright;
