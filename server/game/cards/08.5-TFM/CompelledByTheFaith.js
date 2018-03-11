const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class CompelledByTheFaith extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                _.each(this.game.filterCardsInPlay(card => card.power > 0), card => {
                    this.game.movePower(card, card.controller.faction, card.power);
                });
                this.game.addMessage('{0} uses {1} to move all power from each card in play to their controller faction card',
                    this.controller, this);
            }
        });
    }
}

CompelledByTheFaith.code = '08100';

module.exports = CompelledByTheFaith;
