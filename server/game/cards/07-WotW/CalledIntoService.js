const PlotCard = require('../../plotcard.js');

class CalledIntoService extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let topCard = this.controller.drawDeck[0];

                if(topCard.getType() === 'character') {
                    this.controller.putIntoPlay(topCard);
                    this.game.addMessage('{0} uses {1} to reveal {2} as the top card of their deck and put it into play',
                        this.controller, this, topCard);
                } else if(this.controller.canDraw() || this.controller.canGainGold()) {
                    let msg = '{0} uses {1} to reveal {2} as the top card of their deck';
                    let gold;
                    if(this.controller.canDraw()) {
                        this.controller.drawCardsToHand(1);
                        msg += ', draw it';
                    }
                    if(this.controller.canGainGold()) {
                        gold = this.game.addGold(this.controller, 2);
                        msg += ', gain {3} gold';
                    }

                    this.game.addMessage(msg, this.controller, this, topCard, gold);
                }
            }
        });
    }
}

CalledIntoService.code = '07049';

module.exports = CalledIntoService;
