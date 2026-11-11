import PlotCard from '../../plotcard.js';
import { Flags } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class AtPrinceDoransBehest extends PlotCard {
    // At Prince Doran's Behest (10046)
    // When Revealed: Choose and reveal a new plot card. (Cannot be canceled.)
    setupCardAbilities() {
        this.whenRevealed({
            cannotBeCanceled: true,
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.location === 'plot deck' &&
                    card.controller === context.player &&
                    !card.hasFlag(Flags.card.notConsideredToBeInPlotDeck),
                cardType: 'plot'
            },
            message: '{player} uses {source} to reveal {target}',
            gameAction: GameActions.revealNewPlot((context) => ({
                card: context.target,
                player: context.player,
                parentEvent: context.event
            }))
        });
    }
}

AtPrinceDoransBehest.code = '10046';

export default AtPrinceDoransBehest;
