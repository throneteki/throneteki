const PlotCard = require('../../plotcard.js');

class TradingWithThePentoshi extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.addMessage('Each opponent gains 3 gold from {0}\'s {1}', this.controller, this);
                for(let opponent of this.game.getOpponents(this.controller)) {
                    this.game.addGold(opponent, 3);
                }
            }
        });
    }
}

TradingWithThePentoshi.code = '02039';

module.exports = TradingWithThePentoshi;
