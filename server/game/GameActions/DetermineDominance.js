import GameAction from './GameAction.js';
import Message from '../Message.js';
import DetermineDominanceStep from '../gamesteps/DetermineDominance.js';

class DetermineDominance extends GameAction {
    constructor() {
        super('determineDominance');
    }

    message() {
        return Message.fragment('determines dominance');
    }

    canChangeGameState() {
        return true;
    }

    createEvent({ context }) {
        return this.event('onDetermineDominance', {}, () => {
            context.game.queueStep(new DetermineDominanceStep(context.game, context.source));
        });
    }
}

export default new DetermineDominance();
