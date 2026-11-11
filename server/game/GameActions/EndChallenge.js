import GameAction from './GameAction.js';
import Message from '../Message.js';

class EndChallenge extends GameAction {
    constructor() {
        super('endChallenge');
    }

    message() {
        return Message.fragment('ends the challenge with no winner or loser');
    }

    canChangeGameState({ challenge }) {
        return !!challenge && !challenge.cancelled && challenge.game.currentChallenge === challenge;
    }

    createEvent({ challenge }) {
        return this.event('onChallengeEnded', { challenge }, (event) => {
            event.challenge.cancelChallenge();
        });
    }
}

export default new EndChallenge();
