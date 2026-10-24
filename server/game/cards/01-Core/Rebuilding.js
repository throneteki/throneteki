import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class Rebuilding extends PlotCard {
    // Rebuilding (01019)
    // When Revealed: Choose up to 3 cards in your discard pile, and shuffle them into your deck.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                numCards: 3,
                activePromptTitle: 'Select up to 3 cards',
                cardCondition: (card, context) =>
                    context.player === card.controller && card.location === 'discard pile'
            },
            message: '{player} uses {source} to shuffle {target} into their deck',
            gameAction: GameActions.shuffleIntoDeck((context) => ({ cards: context.target }))
        });
    }
}

Rebuilding.code = '01019';

export default Rebuilding;
