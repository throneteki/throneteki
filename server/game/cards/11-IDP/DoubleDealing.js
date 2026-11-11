import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class DoubleDealing extends PlotCard {
    // Double-Dealing (11100)
    // Plot Action: Choose a plot card in an opponent's used pile. Double-Dealing gains that plot
    // card's printed text box (except for Traits) until you reveal a new plot card. (Limit once per
    // round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy a plot card text box',
            phase: 'plot',
            limit: ability.limit.perRound(1),
            target: {
                cardType: 'plot',
                cardCondition: (card, context) =>
                    card.getType() === 'plot' &&
                    card.location === 'revealed plots' &&
                    card !== card.controller.activePlot &&
                    card.controller !== context.player
            },
            message: "{player} uses {source} to copy {target}'s text box",
            gameAction: GameActions.copyPlotTextBox((context) => ({
                source: context.source,
                target: context.target
            }))
        });
    }
}

DoubleDealing.code = '11100';

export default DoubleDealing;
