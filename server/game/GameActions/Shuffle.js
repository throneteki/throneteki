const GameAction = require('./GameAction');

class Shuffle extends GameAction {
    constructor() {
        super('shuffle');
    }

    canChangeGameState({ player }) {
        return player.drawDeck.length > 0;
    }

    createEvent({ player }) {
        return this.event('onDeckShuffled', { player }, event => {
            event.player.shuffleDrawDeck();
        });
    }
}

module.exports = new Shuffle();
