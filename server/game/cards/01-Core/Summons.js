const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

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
        });
    }
}

Summons.code = '01022';

module.exports = Summons;
