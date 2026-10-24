import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class SearchAndDetain extends PlotCard {
    // Search and Detain (16034)
    // When Revealed: Choose a card without attachments controlled by the first player. Return it to
    // its owner's hand (cannot be saved).
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.isMatch({ location: 'play area', hasAttachments: false }) &&
                    card.controller.firstPlayer
            },
            message: '{player} uses {source} to return {target} to hand',
            gameAction: GameActions.returnCardToHand((context) => ({
                card: context.target,
                allowSave: false
            }))
        });
    }
}

SearchAndDetain.code = '16034';

export default SearchAndDetain;
