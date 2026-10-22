import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TradeRoutes extends PlotCard {
    // Trade Routes (09051)
    // When Revealed: Choose an opponent. Gain 1 gold for each location you control and each
    // location that opponent controls.
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: () => true,
            message: {
                format: '{player} uses {source} to choose {opponent} and gain {amount} gold',
                args: {
                    amount: (context) =>
                        context.player.getNumberOfCardsInPlay(
                            (card) => card.getType() === 'location'
                        ) +
                        context.opponent.getNumberOfCardsInPlay(
                            (card) => card.getType() === 'location'
                        )
                }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount:
                    context.player.getNumberOfCardsInPlay((card) => card.getType() === 'location') +
                    context.opponent.getNumberOfCardsInPlay((card) => card.getType() === 'location')
            }))
        });
    }
}

TradeRoutes.code = '09051';

export default TradeRoutes;
