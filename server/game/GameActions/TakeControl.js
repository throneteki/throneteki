const GameAction = require('./GameAction');

class TakeControl extends GameAction {
    constructor() {
        super('takeControl');
    }

    canChangeGameState({ player, card }) {
        return player.canControl(card);
    }

    createEvent({ player, card, context }) {
        return this.event('__PLACEHOLDER_EVENT__', { player, card }, event => {
            context.game.takeControl(event.player, event.card, context.source);
        });
    }
}

module.exports = new TakeControl();
