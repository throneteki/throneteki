const GameAction = require('./GameAction');

class EndRound extends GameAction {
    constructor() {
        super('endRound');
    }

    canChangeGameState({ game }) {
        return game.currentPhase !== 'setup';
    }

    createEvent({ game }) {
        return this.event('onRoundEnded', { game }, event => {
            event.thenAttachEvent(this.event('onAtEndOfRound', { game }));
        });
    }
}

module.exports = new EndRound();
