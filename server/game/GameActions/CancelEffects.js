const GameAction = require('./GameAction');

class CancelEffects extends GameAction {
    constructor() {
        super('cancelEffects');
    }

    canChangeGameState() {
        return true;
    }

    createEvent({ event }) {
        return this.event('onEffectsCanceled', { canceledEvent: event }, (event) => {
            event.canceledEvent.cancel();
        });
    }
}

module.exports = new CancelEffects();
