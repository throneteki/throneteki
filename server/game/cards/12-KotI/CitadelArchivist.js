import DrawCard from '../../drawcard.js';

class CitadelArchivist extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.location === 'discard pile' &&
                    event.player === this.controller &&
                    event.card === this
            },
            location: 'discard pile',
            message: "{player} uses {source} to shuffle each player's discard pile into their deck",
            handler: () => {
                for (let player of this.game.getPlayersInFirstPlayerOrder()) {
                    for (let card of player.discardPile) {
                        player.moveCard(card, 'draw deck');
                    }

                    player.shuffleDrawDeck();
                }
            }
        });
    }
}

CitadelArchivist.code = '12041';

export default CitadelArchivist;
