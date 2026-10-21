import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CitadelArchivist extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card === this &&
                    event.card.location === 'discard pile' &&
                    event.player === this.controller
            },
            location: 'discard pile',
            message: "{player} uses {source} to shuffle each player's discard pile into their deck",
            gameAction: GameActions.shuffleIntoDeck((context) => ({
                cards: context.game.getPlayers().flatMap((player) => [...player.discardPile])
            }))
        });
    }
}

CitadelArchivist.code = '12041';

export default CitadelArchivist;
