const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class BenjensCache extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            condition: context => !context.player.plotDiscard.some(card => card.hasTrait('Kingdom')),
            gameAction: GameActions.search({
                title: 'Select a card',
                message: '{player} uses {source} to search their deck and add a card to their hand',
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BenjensCache.code = '16031';

module.exports = BenjensCache;
