const PlotCard = require('../../plotcard.js');

class AtTheGates extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to search their deck for a limited location with printed cost 1 or lower',
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getPrintedCost() <= 1 && card.isLimited(),
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    hasUsedCityPlot(player) {
        return player.getNumberOfUsedPlotsByTrait('City') > 0;
    }

    cardSelected(player, card, valid) {
        if(valid) {
            if(this.hasUsedCityPlot(player)) {
                this.game.addMessage('{0} adds {1} to their hand',
                    player, card);
                player.moveCard(card, 'hand');
            } else {
                this.game.addMessage('{0} puts {1} into play', player, card);
                player.putIntoPlay(card);
            }
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not retrieve any card',
            player, this);
    }
}

AtTheGates.code = '13020';

module.exports = AtTheGates;
