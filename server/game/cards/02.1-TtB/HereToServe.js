const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class HereToServe extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to search their deck for a Maester character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Maester', printedCostOrLower: 3 },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

HereToServe.code = '02020';

module.exports = HereToServe;
