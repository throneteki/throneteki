import GameAction from './GameAction.js';
import Message from '../Message.js';

/**
 * Changes the type of a challenge in progress. The challenge is still considered to have been
 * initiated as its original type (`initiatedChallengeType`).
 */
class ChangeChallengeType extends GameAction {
    constructor() {
        super('changeChallengeType');
    }

    message({ challenge, challengeType }) {
        return Message.fragment('change the challenge type from {from} to {to}', {
            from: challenge.challengeType,
            to: challengeType
        });
    }

    canChangeGameState({ challenge, challengeType }) {
        return !!challenge && challenge.challengeType !== challengeType;
    }

    createEvent({ challenge, challengeType }) {
        return this.event('__PLACEHOLDER_EVENT__', {}, () => {
            challenge.challengeType = challengeType;
            challenge.calculateStrength();
        });
    }
}

export default new ChangeChallengeType();
