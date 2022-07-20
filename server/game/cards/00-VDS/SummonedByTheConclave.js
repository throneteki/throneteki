const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class SummonedByTheConclave extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to search the top 10 cards of their deck for an in-faction card',
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select a card',
                match: { condition: card => card.isFaction(this.controller.getFaction()) },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

SummonedByTheConclave.code = '00007';

module.exports = SummonedByTheConclave;
