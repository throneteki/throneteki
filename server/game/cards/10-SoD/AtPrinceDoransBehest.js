const RevealPlots = require('../../gamesteps/revealplots.js');
const PlotCard = require('../../plotcard.js');

class AtPrinceDoransBehest extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            cannotBeCanceled: true,
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.location === 'plot deck' &&
                    card.controller === context.player &&
                    !card.notConsideredToBeInPlotDeck,
                cardType: 'plot'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to reveal {2}',
                    context.player,
                    this,
                    context.target
                );

                context.player.selectedPlot = context.target;
                this.game.queueStep(new RevealPlots(this.game, [context.target], context.event));
            }
        });
    }
}

AtPrinceDoransBehest.code = '10046';

module.exports = AtPrinceDoransBehest;
