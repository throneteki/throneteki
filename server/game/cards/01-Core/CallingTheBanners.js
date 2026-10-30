import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class CallingTheBanners extends PlotCard {
    // Calling the Banners (01007)
    // When Revealed: Choose an opponent. Gain 1 gold for each character that player controls.
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            message: {
                format: '{player} uses {source} to gain {amount} gold',
                args: {
                    amount: (context) =>
                        context.opponent.getNumberOfCardsInPlay(
                            (card) => card.getType() === 'character'
                        )
                }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: context.opponent.getNumberOfCardsInPlay(
                    (card) => card.getType() === 'character'
                )
            }))
        });
    }
}

CallingTheBanners.code = '01007';

export default CallingTheBanners;
