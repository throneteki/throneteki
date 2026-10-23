import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

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
            message:
                '{player} uses {source} to let each opponent return their revealed plot and reveal {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.targets.selections
                    .filter((selection) => !!selection.value)
                    .map((selection) =>
                        GameActions.returnPlotToDeck({
                            card: selection.choosingPlayer.activePlot
                        }).then({
                            gameAction: GameActions.revealNewPlot({
                                card: selection.value,
                                player: selection.choosingPlayer,
                                parentEvent: context.event
                            })
                        })
                    )
            )
        });
    }
}

TheGatheringStorm.code = '16036';

export default TheGatheringStorm;
