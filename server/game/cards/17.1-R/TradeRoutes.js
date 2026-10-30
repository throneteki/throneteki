import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TradeRoutes extends PlotCard {
    // Trade Routes (17160)
    // When Revealed: Choose a player. Gain 1 gold for each location that player controls.
    setupCardAbilities() {
        this.whenRevealed({
            choosePlayer: () => true,
            message: {
                format: '{player} uses {source} to choose {chosenPlayer} and gain {amount} gold',
                args: {
                    amount: (context) =>
                        context.chosenPlayer.getNumberOfCardsInPlay(
                            (card) => card.getType() === 'location'
                        )
                }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: context.chosenPlayer.getNumberOfCardsInPlay(
                    (card) => card.getType() === 'location'
                )
            }))
        });
    }
}

TradeRoutes.code = '17160';

export default TradeRoutes;
