const GameAction = require('./GameAction');

class PlaceCard extends GameAction {
    constructor() {
        super('placeCard');
    }

    canChangeGameState({ player, card, location, bottom = false }) {
        player = location === 'play area' ? player || card.controller : card.owner;

        if(location === 'draw deck') {
            return (
                player.drawDeck[0] !== card && !bottom ||
                player.drawDeck[player.drawDeck.length - 1] !== card && bottom
            );
        }

        return card.location !== location;
    }

    createEvent({ card, player, location, bottom = false }) {
        player = player || card.controller;
        return this.event('onCardPlaced', { card, location, player, bottom }, event => {
            const actualPlayer = event.location !== 'play area' ? event.card.owner : event.player;
            actualPlayer.placeCardInPile({ card, location, bottom });
        });
    }
}

module.exports = new PlaceCard();
