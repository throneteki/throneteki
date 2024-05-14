const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');

class SearchAndDetain extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.isMatch({ location: 'play area', hasAttachments: false }) &&
                    card.controller.firstPlayer
            },
            message: '{player} uses {source} to return {target} to hand',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({
                        card: context.target,
                        allowSave: false
                    })),
                    context
                );
            }
        });
    }
}

SearchAndDetain.code = '16034';

module.exports = SearchAndDetain;
