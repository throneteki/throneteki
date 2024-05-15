import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class Summons extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a character',
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select a character',
                match: { type: 'character' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Summons.code = '01022';

export default Summons;
