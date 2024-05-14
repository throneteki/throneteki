import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

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

export default SearchAndDetain;
