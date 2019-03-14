const GameAction = require('./GameAction');

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
            event.player.moveCard(event.card, 'discard pile');
        });
    }
}

module.exports = new SacrificeCard();
