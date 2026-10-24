import GameAction from './GameAction.js';

class ResetRound extends GameAction {
    constructor() {
        super('resetRound');
    }

    createEvent({ players }) {
        return this.event('onRoundReset', { players }, (event) => {
            for (const player of event.players) {
                player.resetForStartOfRound();
            }
        });
    }
}

export default new ResetRound();
