import GameAction from './GameAction.js';

class DeclineChoice extends GameAction {
    constructor() {
        super('declineChoice');
    }

    allow(context) {
        return !!(context?.choosingPlayer || context?.parentContext);
    }

    createEvent(context) {
        return this.event('onChoiceDeclined', { player: context.choosingPlayer || context.player });
    }
}

export default new DeclineChoice();
