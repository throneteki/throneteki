import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheWhiteSwords extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.hasTrait('Kingsguard') &&
                    card.controller === context.player &&
                    ['hand', 'discard pile'].includes(card.location) &&
                    context.player.canPutIntoPlay(card)
            },
            message: {
                format: '{player} uses {source} to put {target} into play from their {originalLocation}',
                args: { originalLocation: (context) => context.target.location }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        player: context.player,
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

TheWhiteSwords.code = '15048';

export default TheWhiteSwords;
