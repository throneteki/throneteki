const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class BenjensCache extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            condition: () => !this.controller.plotDiscard.some(card => card.hasTrait('Kingdom')),
            gameAction: GameActions.search({
                title: 'Select a card',
                message: '{player} uses {source} to search their deck and add {searchTarget} to their hand',
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BenjensCache.code = '16031';

module.exports = BenjensCache;
