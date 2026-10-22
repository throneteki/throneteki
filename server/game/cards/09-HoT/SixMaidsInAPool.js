import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SixMaidsInAPool extends DrawCard {
    // "Six Maids in a Pool" (09023)
    // Action: Draw 1 card for each Lady character you control.
    setupCardAbilities() {
        this.action({
            title: 'Draw cards',
            condition: (context) => context.source.controller.canDraw(),
            message: {
                format: '{player} plays {source} to draw {amount} cards',
                args: {
                    amount: (context) =>
                        context.player.getNumberOfCardsInPlay(
                            (card) => card.hasTrait('Lady') && card.getType() === 'character'
                        )
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.player.getNumberOfCardsInPlay(
                    (card) => card.hasTrait('Lady') && card.getType() === 'character'
                )
            }))
        });
    }
}

SixMaidsInAPool.code = '09023';

export default SixMaidsInAPool;
