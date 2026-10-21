import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TradingWithThePentoshi extends PlotCard {
    // Trading with the Pentoshi (02039)
    // When Revealed: Each opponent gains 3 gold. (Cannot be canceled.)
    setupCardAbilities() {
        this.whenRevealed({
            cannotBeCanceled: true,
            message: '{player} uses {source} to have each opponent gain 3 gold',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getOpponents(context.player)
                    .map((opponent) => GameActions.gainGold({ player: opponent, amount: 3 }))
            )
        });
    }
}

TradingWithThePentoshi.code = '02039';

export default TradingWithThePentoshi;
