import GameAction from './GameAction.js';
import Message from '../Message.js';

class RedirectChallenge extends GameAction {
    constructor() {
        super('redirectChallenge');
    }

    message({ player }) {
        return Message.fragment('redirects the challenge to {player}', { player });
    }

    canChangeGameState({ challenge, player }) {
        return (
            !!challenge &&
            !challenge.cancelled &&
            challenge.game.currentChallenge === challenge &&
            challenge.game.getOpponents(challenge.initiatingPlayer).includes(player) &&
            player !== challenge.defendingPlayer &&
            player !== challenge.initiatedAgainstPlayer
        );
    }

    createEvent({ challenge, player }) {
        return this.event(
            'onChallengeRedirected',
            {
                challenge,
                player,
                previousDefender: challenge.defendingPlayer
            },
            (event) => {
                event.challenge.game.currentChallengeStep.redirectChallengeTo(event.player);
            }
        );
    }
}

export default new RedirectChallenge();
