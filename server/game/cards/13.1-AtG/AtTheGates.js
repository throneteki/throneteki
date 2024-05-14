const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class AtTheGates extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message:
                '{player} uses {source} to search their deck for a limited location with printed cost 1 or lower',
            gameAction: GameActions.search({
                title: 'Select a location',
                match: { type: 'location', printedCostOrLower: 1, limited: true },
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: (context) => context.player.getNumberOfUsedPlotsByTrait('City') > 0,
                    thenAction: GameActions.addToHand((context) => ({
                        card: context.searchTarget
                    })),
                    elseAction: GameActions.putIntoPlay((context) => ({
                        card: context.searchTarget
                    }))
                })
            })
        });
    }
}

AtTheGates.code = '13020';

module.exports = AtTheGates;
