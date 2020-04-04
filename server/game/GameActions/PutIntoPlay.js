const GameAction = require('./GameAction');

class PutIntoPlay extends GameAction {
    constructor() {
        super('putIntoPlay');
    }

    canChangeGameState({ player, card }) {
        player = player || card.controller;
        return player.canPutIntoPlay(card);
    }

    createEvent({ player, card, kneeled }) {
        player = player || card.controller;
        return this.event('__PLACEHOLDER_EVENT__', { player, card }, event => {
            event.player.putIntoPlay(event.card, 'play', { kneeled });
        });
    }
}

module.exports = new PutIntoPlay();
