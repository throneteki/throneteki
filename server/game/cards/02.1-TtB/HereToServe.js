import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class HereToServe extends PlotCard {
    // Here to Serve (02020)
    // When Revealed: Search your deck for a Maester character with printed cost 3 or lower, and put
    // it into play. Shuffle your deck.
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to search their deck for a Maester character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Maester', printedCostOrLower: 3 },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

HereToServe.code = '02020';

export default HereToServe;
