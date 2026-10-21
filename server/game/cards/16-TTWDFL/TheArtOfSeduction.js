import PlotCard from '../../plotcard.js';

class TheArtOfSeduction extends PlotCard {
    // The Art of Seduction (16035)
    // When Revealed: Choose an opponent. That opponent cannot reveal a new plot card during the
    // next plot phase.
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            message: '{player} uses {source} to prevent {opponent} from revealing a new plot',
            handler: (context) => {
                const currentRound = context.game.round;
                // TODO: Only apply the effect during the plot phase. This is okay for now
                // because other plot revealing cards don't check the flag
                this.lastingEffect((ability) => ({
                    until: {
                        onAtEndOfPhase: (event) =>
                            event.phase === 'plot' && this.game.round >= currentRound + 1
                    },
                    match: context.opponent,
                    effect: ability.effects.cannotRevealPlot()
                }));
            }
        });
    }
}

TheArtOfSeduction.code = '16035';

export default TheArtOfSeduction;
