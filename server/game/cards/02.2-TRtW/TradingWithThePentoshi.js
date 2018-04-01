const PlotCard = require('../../plotcard.js');

class TradingWithThePentoshi extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            cannotBeCanceled: true,
            handler: () => {
                for(let opponent of this.game.getOpponents(this.controller)) {
                    this.game.addGold(opponent, 3);
                }
                this.game.addMessage('Each opponent gains 3 gold from {0}\'s {1}', this.controller, this);
            }
        });
    }
}

TradingWithThePentoshi.code = '02039';

module.exports = TradingWithThePentoshi;
