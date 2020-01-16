const GameAction = require('./GameAction');

class HandlerGameActionWrapper extends GameAction {
    constructor({ handler }) {
        super('handler');

        this.handler = handler;
    }

    allow() {
        return true;
    }

    createEvent(context) {
        return this.event('__PLACEHOLDER_EVENT__', {}, () => {
            this.handler(context);
        });
    }
}

module.exports = HandlerGameActionWrapper;
