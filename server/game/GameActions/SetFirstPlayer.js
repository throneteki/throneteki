import GameAction from './GameAction.js';
import Message from '../Message.js';

class SetFirstPlayer extends GameAction {
    constructor() {
        super('setFirstPlayer');
    }

    message({ player }) {
        return Message.fragment('makes {player} the first player', { player });
    }

    canChangeGameState({ player }) {
        return !player.firstPlayer;
    }

    createEvent({ player }) {
        return this.event('onFirstPlayerDetermined', { player }, (event) => {
            for (const p of event.player.game.getAllPlayers()) {
                p.firstPlayer = p === event.player;
            }
        });
    }
}

export default new SetFirstPlayer();
