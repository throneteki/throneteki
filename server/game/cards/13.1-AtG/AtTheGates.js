const PlotCard = require('../../plotcard.js');

class AtTheGates extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getPrintedCost() <= 1 && card.isLimited(),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    hasUsedCityPlot(player) {
        return player.getNumberOfUsedPlotsByTrait('City') > 0;
    }

    cardSelected(player, card) {
        if(this.hasUsedCityPlot(player)) {
            this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
                player, this, card);
            player.moveCard(card, 'hand');
        } else {
            this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);
            player.putIntoPlay(card);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not retrieve any card',
            player, this);
    }
}

AtTheGates.code = '13020';

module.exports = AtTheGates;
