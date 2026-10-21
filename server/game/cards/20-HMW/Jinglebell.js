import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Jinglebell extends DrawCard {
    // Jinglebell (20046)
    // Interrupt: When Jinglebell is killed, search your deck for a card that shares a Trait with
    // him, reveal it, and add it to your hand. Shuffle your deck.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this
            },
            message:
                '{player} uses {source} to search their deck for a card that shares a Trait with him',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: {
                    type: 'character',
                    condition: (card) => card.getTraits().some((trait) => this.hasTrait(trait))
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Jinglebell.code = '20046';

export default Jinglebell;
