import GameAction from './GameAction.js';

class HandlerGameActionWrapper extends GameAction {
    constructor({ handler, canChangeGameState }) {
        super('handler');

        this.handler = handler;
        if (typeof canChangeGameState !== 'function') {
            throw new Error(
                'Callback game actions require an explicit canChangeGameState predicate'
            );
        }
        this.canChange = canChangeGameState;
    }

    allow(context) {
        return this.canChange(context);
    }

    logsOwnMessage() {
        return true;
    }

    createEvent(context) {
        return this.event('__PLACEHOLDER_EVENT__', {}, () => {
            this.handler(context);
        });
    }
}

export default HandlerGameActionWrapper;
