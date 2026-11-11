import GameAction from './GameAction.js';

class QueueChallengeAction extends GameAction {
    constructor() {
        super('queueChallengeAction');
    }

    canChangeGameState({ action, ...properties }) {
        return action.allow(properties);
    }

    isImmune() {
        return false;
    }

    createEvent({ action, challenge, source, card }) {
        return this.event('onChallengeInitiationActionQueued', { challenge, source, card }, () => {
            challenge.addInitiationAction(action, { challenge, source, card });
        });
    }
}

export default new QueueChallengeAction();
