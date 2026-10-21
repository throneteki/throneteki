import sample from 'lodash.sample';
import DrawCard from '../../drawcard.js';

class BeneathTheBridgeOfDream extends DrawCard {
    // Beneath the Bridge of Dream (11011)
    // Shadow (0).
    // Interrupt: When you choose a plot card to reveal in the plot phase, instead shuffle your used
    // pile into your plot deck and choose a plot card to reveal at random. Until the end of the
    // round, increase the gold value on your revealed plot card by 2.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onChoosePlot: (event) =>
                    event.players.includes(this.controller) && this.game.currentPhase === 'plot'
            },
            handler: () => {
                this.game.addMessage(
                    '{0} plays {1} to shuffle their used pile into their plot deck, randomly choose a plot to reveal and give +2 gold to their revealed plot',
                    this.controller,
                    this
                );
                for (const plot of this.controller.plotDiscard) {
                    this.controller.moveCard(plot, 'plot deck');
                }
                // Delay picking the plot until the async recycle above resolves
                this.game.queueSimpleStep(() => {
                    let plot = sample(this.controller.getPlots());
                    this.untilEndOfPhase((ability) => ({
                        targetController: 'current',
                        effect: ability.effects.mustRevealPlot(plot)
                    }));
                    this.untilEndOfRound((ability) => ({
                        condition: () => true,
                        match: (card) => card === card.controller.activePlot,
                        effect: ability.effects.modifyGold(2)
                    }));
                });
            }
        });
    }
}

BeneathTheBridgeOfDream.code = '11011';

export default BeneathTheBridgeOfDream;
