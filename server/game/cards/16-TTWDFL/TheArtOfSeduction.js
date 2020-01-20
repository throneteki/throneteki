const PlotCard = require('../../plotcard.js');

class TheArtOfSeduction extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            message: '{player} uses {source} to prevent {opponent} from revealing a new plot',
            handler: context => {
                const currentRound = context.game.round;
                this.lastingEffect(ability => ({
                    until: {
                        atEndOfPhase: event => event.phase === 'plot' && this.game.round === (currentRound + 1)
                    },
                    condition: () => this.game.currentPhase === 'plot',
                    match: context.opponent,
                    effect: ability.effects.cannotRevealPlot()
                }));
            }
        });
    }
}

TheArtOfSeduction.code = '16035';

module.exports = TheArtOfSeduction;
