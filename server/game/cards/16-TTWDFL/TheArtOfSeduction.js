import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheArtOfSeduction extends PlotCard {
    // The Art of Seduction (16035)
    // When Revealed: Choose an opponent. That opponent cannot reveal a new plot card during the
    // next plot phase.
    setupCardAbilities(ability) {
        this.whenRevealed({
            chooseOpponent: true,
            message: '{player} uses {source} to prevent {opponent} from revealing a new plot',
            gameAction: GameActions.lastingEffect((context) => {
                const currentRound = context.game.round;
                return {
                    duration: 'custom',
                    until: {
                        onAtEndOfPhase: (event) =>
                            event.phase === 'plot' && context.game.round >= currentRound + 1
                    },
                    match: context.opponent,
                    effect: ability.effects.cannotRevealPlot()
                };
            })
        });
    }
}

TheArtOfSeduction.code = '16035';

export default TheArtOfSeduction;
