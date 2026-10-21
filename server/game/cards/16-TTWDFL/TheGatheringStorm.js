import PlotCard from '../../plotcard.js';
import RevealPlots from '../../gamesteps/revealplots.js';

class TheGatheringStorm extends PlotCard {
    // The Gathering Storm (16036)
    // When Revealed: Each opponent may return his or her revealed plot card to his or her plot deck
    // and reveal a new plot card.
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

export default TheGatheringStorm;
