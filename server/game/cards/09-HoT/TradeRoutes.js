const PlotCard = require('../../plotcard.js');

class TradeRoutes extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: () => true,
            handler: context => {
                let playerLocations = context.player.getNumberOfCardsInPlay(card => card.getType() === 'location');
                let opponentLocations = context.opponent.getNumberOfCardsInPlay(card => card.getType() === 'location');
                let gold = playerLocations + opponentLocations;

                this.game.addGold(this.controller, gold);
                this.game.addMessage('{0} uses {1} to choose {2} and gain {3} gold', context.player, this, context.opponent, gold);
            }
        });
    }
}

TradeRoutes.code = '09051';

module.exports = TradeRoutes;
