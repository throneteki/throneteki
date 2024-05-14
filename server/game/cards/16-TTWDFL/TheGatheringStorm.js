const PlotCard = require('../../plotcard');
const RevealPlots = require('../../gamesteps/revealplots');

class TheGatheringStorm extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'eachOpponent',
                optional: true,
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) => context.choosingPlayer.plotDeck.includes(card),
                cardType: 'plot'
            },
            handler: (context) => {
                const plots = [];

                for (const selection of context.targets.selections) {
                    const player = selection.choosingPlayer;
                    const plot = selection.value;
                    if (plot) {
                        this.game.addMessage('{player} chooses to reveal {plot} for {source}', {
                            player,
                            plot,
                            source: this
                        });
                        player.selectedPlot = plot;
                        player.moveCard(player.activePlot, 'plot deck');
                        player.activePlot = null;
                        plots.push(plot);
                    } else {
                        this.game.addMessage(
                            '{player} does not choose to reveal a plot for {source}',
                            { player, source: this }
                        );
                    }
                }

                if (plots.length > 0) {
                    this.game.queueStep(new RevealPlots(this.game, plots, context.event));
                }
            }
        });
    }
}

TheGatheringStorm.code = '16036';

module.exports = TheGatheringStorm;
