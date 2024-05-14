import GameAction from './GameAction.js';
import DiscardToReservePrompt from '../gamesteps/taxation/DiscardToReservePrompt.js';

class CheckReserve extends GameAction {
    constructor() {
        super('checkReserve');
    }

    createEvent({ context }) {
        // TODO: This should be an event that checks reserve for an individual
        // player, but with the World Cup going on, we don't want to make any
        // disruptive larger scale changes
        return this.event('__PLACEHOLDER_EVENT__', {}, () => {
            context.game.queueStep(new DiscardToReservePrompt(context.game, context.source));
        });
    }
}

export default new CheckReserve();
