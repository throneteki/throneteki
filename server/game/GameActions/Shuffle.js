import GameAction from './GameAction.js';

class Shuffle extends GameAction {
    constructor() {
        super('shuffle');
    }

    message() {
        return 'shuffles their deck';
    }

    canChangeGameState({ player }) {
        return player.drawDeck.length > 0;
    }

    createEvent({ player }) {
        return this.event('onDeckShuffled', { player }, (event) => {
            event.player.shuffleDrawDeck();
        });
    }
}

export default new Shuffle();
