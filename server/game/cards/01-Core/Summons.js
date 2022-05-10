const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');
const { context } = require('raven');

class Summons extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select a character',
                match: { type: 'character' },
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget
                }))
            })
            // .then(() => ({
            //     format: '{player} uses {source} to {performedActions}',
            //     gameActions: {
            //         search: 'search their deck for {searchTarget}',
            //         reveal: 'reveal it',
            //         addToHand: 'add it to their hand'
            //     })
            // )
        });
    }
}
Summons.code = '01022';

module.exports = Summons;
