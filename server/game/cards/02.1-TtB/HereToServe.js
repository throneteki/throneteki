const PlotCard = require('../../plotcard.js');

class HereToServe extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('Maester') && card.getPrintedCost() <= 3 && context.player.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play',
            player, this, card);
        player.putIntoPlay(card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into play',
            player, this);
    }
}

HereToServe.code = '02020';

module.exports = HereToServe;
