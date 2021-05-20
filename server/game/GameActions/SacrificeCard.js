const GameAction = require('./GameAction');
const PlaceCard = require('./PlaceCard');

class SacrificeCard extends GameAction {
    constructor() {
        super('sacrifice');
    }

    canChangeGameState({ card }) {
        return card.location === 'play area';
    }

    createEvent({ card, player }) {
        player = player || card.controller;
        return this.event('onSacrificed', { card, player }, event => {
            event.cardStateWhenSacrificed = event.card.createSnapshot();
            event.thenAttachEvent(PlaceCard.createEvent({ card: card, location: 'discard pile' }));
        });
    }
}

module.exports = new SacrificeCard();
