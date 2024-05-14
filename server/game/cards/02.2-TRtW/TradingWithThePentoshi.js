const PlotCard = require('../../plotcard.js');

class TradingWithThePentoshi extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            cannotBeCanceled: true,
            handler: (context) => {
                for (let opponent of this.game.getOpponents(context.player)) {
                    this.game.addGold(opponent, 3);
                }
                this.game.addMessage(
                    "Each opponent gains 3 gold from {0}'s {1}",
                    context.player,
                    this
                );
            }
        });
    }
}

TradingWithThePentoshi.code = '02039';

module.exports = TradingWithThePentoshi;
