const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class Summons extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select a character',
                match: { type: 'character' },
                // message: '{player} uses {source} to search their deck and add {searchTarget} to their hand',
                gameAction: GameActions.revealCards({
                    match: {
                        condition: (card, context) => card === context.searchTarget
                    },
                    gameAction: GameActions.addToHand(context => ({
                        card: context.cards[0]
                    }))
                })
            })
        });
    }
}

Summons.code = '01022';

module.exports = Summons;
