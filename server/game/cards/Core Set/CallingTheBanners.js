const PlotCard = require('../../plotcard.js');

class CallingTheBanners extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: context => {
                let characterCount = context.opponent.getNumberOfCardsInPlay(card => card.getType() === 'character');

                if(characterCount <= 0) {
                    return;
                }

                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, characterCount);
                this.game.addGold(this.controller, characterCount);
            }
        });
    }
}

CallingTheBanners.code = '01007';

module.exports = CallingTheBanners;
