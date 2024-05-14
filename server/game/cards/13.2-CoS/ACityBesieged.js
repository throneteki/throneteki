const PlotCard = require('../../plotcard.js');

class ACityBesieged extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                let numTargets = this.hasUsedCityPlot(context.player) ? 2 : 1;

                this.game.promptForSelect(context.player, {
                    mode: 'upTo',
                    numCards: numTargets,
                    activePromptTitle: this.hasUsedCityPlot(context.player)
                        ? 'Select up to 2 locations'
                        : 'Select a location',
                    source: this,
                    gameAction: 'kneel',
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.getType() === 'location' &&
                        !card.kneeled,
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                });
            }
        });
    }

    targetsSelected(player, cards) {
        for (let card of cards) {
            player.kneelCard(card);
        }

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, cards);
        return true;
    }

    hasUsedCityPlot(player) {
        return player.getNumberOfUsedPlotsByTrait('City') > 0;
    }
}

ACityBesieged.code = '13040';

module.exports = ACityBesieged;
