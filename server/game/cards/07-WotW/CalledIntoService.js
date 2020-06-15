const PlotCard = require('../../plotcard.js');

class CalledIntoService extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: context => {
                let topCard = context.player.drawDeck[0];

                if(topCard.getType() === 'character') {
                    context.player.putIntoPlay(topCard);
                    this.game.addMessage('{0} uses {1} to reveal {2} as the top card of their deck and put it into play',
                        context.player, this, topCard);
                } else if(context.player.canDraw() || context.player.canGainGold()) {
                    let msg = '{0} uses {1} to reveal {2} as the top card of their deck';
                    let gold;
                    if(context.player.canDraw()) {
                        context.player.drawCardsToHand(1);
                        msg += ', draw it';
                    }
                    if(context.player.canGainGold()) {
                        gold = this.game.addGold(context.player, 2);
                        msg += ', gain {3} gold';
                    }

                    this.game.addMessage(msg, context.player, this, topCard, gold);
                }
            }
        });
    }
}

CalledIntoService.code = '07049';

module.exports = CalledIntoService;
