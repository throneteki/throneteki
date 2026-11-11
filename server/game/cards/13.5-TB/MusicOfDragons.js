import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MusicOfDragons extends DrawCard {
    // Music of Dragons (13094)
    // Challenges Action: Search your deck for a Dragon character, reveal it, and add it to your
    // hand. Shuffle your deck.
    setupCardAbilities() {
        this.action({
            title: 'Search deck',
            phase: 'challenge',
            message: '{player} plays {source} to search their deck for a Dragon character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Dragon' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

MusicOfDragons.code = '13094';

export default MusicOfDragons;
