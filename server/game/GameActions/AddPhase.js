import GameAction from './GameAction.js';
import Message from '../Message.js';

class AddPhase extends GameAction {
    constructor() {
        super('addPhase');
    }

    message({ phase }) {
        return Message.fragment('adds an additional {phase} phase', { phase });
    }

    canChangeGameState() {
        return true;
    }

    createEvent({ phase, context }) {
        return this.event('onPhaseAdded', { phase }, (event) => {
            context.game.addPhase(event.phase);
        });
    }
}

export default new AddPhase();
