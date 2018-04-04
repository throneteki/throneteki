const RevealPlots = require('../../gamesteps/revealplots.js');
const PlotCard = require('../../plotcard.js');

//TODO: This currently nests the resolution of the When Revealed of the fetched plot within the resolution
//of this plot. Instead, if a new When Revealed is fetched, it should resolve simultaneously with any other
//unresolved When Revealed abilities, allowing the first player to (again) choose the order.
class AtPrinceDoransBehest extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            cannotBeCanceled: true,
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: card => card.controller === this.controller && this.checkPlotForPhase(card),
                cardType: 'plot'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to reveal {2}', context.player, this, context.target);

                context.player.selectedPlot = context.target;
                context.player.removeActivePlot();
                context.player.flipPlotFaceup();
                this.game.queueStep(new RevealPlots(this.game, [context.target]));
            }
        });
    }

    checkPlotForPhase(card) {
        return (this.game.currentPhase !== 'plot') ?
            card.location === 'plot deck' :
            card.location === 'plot deck' && !card.hasTrait('scheme');
    }
}

AtPrinceDoransBehest.code = '10046';

module.exports = AtPrinceDoransBehest;

