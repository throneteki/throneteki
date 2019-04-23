const GameAction = require('./GameAction');

class RemoveFromGame extends GameAction {
    constructor() {
        super('removeFromGame');
    }

    canChangeGameState({ card }) {
        return card.location !== 'out of game';
    }

    createEvent({ card, player, allowSave = true }) {
        player = player || card.controller;
        return this.event('onCardRemovedFromGame', { player, card, allowSave }, event => {
            event.cardStateWhenRemoved = event.card.createSnapshot();
            event.player.moveCard(event.card, 'out of game', { allowSave: event.allowSave });
        });
    }
}

module.exports = new RemoveFromGame();
