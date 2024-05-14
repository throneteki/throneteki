const GameAction = require('./GameAction');
const Message = require('../Message');

class TakeControl extends GameAction {
    constructor() {
        super('takeControl');
    }

    message({ card }) {
        return Message.fragment('takes control of {card}', { card });
    }

    canChangeGameState({ player, card }) {
        return player.canControl(card);
    }

    createEvent({ player, card, context }) {
        return this.event('__PLACEHOLDER_EVENT__', { player, card }, (event) => {
            context.game.takeControl(event.player, event.card, context.source);
        });
    }
}

module.exports = new TakeControl();
