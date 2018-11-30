const DrawCard = require('../../drawcard.js');

class CitadelArchivist extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlaced: event => event.card.location === 'discard pile' &&
                                       event.player === this.controller &&
                                       event.card === this
            },
            handler: () => {
                for(let player of this.game.getPlayersInFirstPlayerOrder()) {
                    for(let card of player.discardPile) {
                        player.moveCard(card, 'draw deck');
                    }

                    player.shuffleDrawDeck();
                }

                this.game.addMessage('{0} uses {1} to shuffle each player\'s discard pile into their deck', this.controller, this);
            }
        });
    }
}

CitadelArchivist.code = '12041';

module.exports = CitadelArchivist;
