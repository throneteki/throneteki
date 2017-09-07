const PlotCard = require('../../plotcard.js');

class HeadsOnSpikes extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: context => {
                let otherPlayer = context.opponent;

                if(otherPlayer.hand.size() === 0) {
                    return true;
                }

                otherPlayer.discardAtRandom(1, cards => {
                    var powerMessage = '';
                    var card = cards[0];

                    if(card.getType() === 'character') {
                        powerMessage = ' and gain 2 power for their faction';
                        otherPlayer.moveCard(card, 'dead pile');

                        this.game.addPower(this.controller, 2);
                    }

                    this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand{4}', this.controller, this, card, otherPlayer, powerMessage);
                });
            }
        });
    }
}

HeadsOnSpikes.code = '01013';

module.exports = HeadsOnSpikes;
