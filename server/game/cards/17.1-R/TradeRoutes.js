const PlotCard = require('../../plotcard.js');

class TradeRoutes extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            choosePlayer: () => true,
            handler: (context) => {
                let playerLocations = context.chosenPlayer.getNumberOfCardsInPlay(
                    (card) => card.getType() === 'location'
                );
                let gold = playerLocations;
                gold = this.game.addGold(context.player, gold);
                this.game.addMessage(
                    '{0} uses {1} to choose {2} and gain {3} gold',
                    context.player,
                    this,
                    context.chosenPlayer,
                    gold
                );
            }
        });
    }
}

TradeRoutes.code = '17160';

module.exports = TradeRoutes;
