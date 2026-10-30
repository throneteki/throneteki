import GameAction from './GameAction.js';

class ChangeEventAmount extends GameAction {
    constructor() {
        super('changeEventAmount');
    }

    canChangeGameState({ event, amount }) {
        return !!event && !event.cancelled && event.amount !== amount;
    }

    createEvent({ event, amount }) {
        return this.event('__PLACEHOLDER_EVENT__', {}, () => {
            event.amount = amount;
        });
    }
}

export default new ChangeEventAmount();
