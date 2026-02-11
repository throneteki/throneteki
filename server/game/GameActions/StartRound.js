import GameAction from './GameAction.js';

class StartRound extends GameAction {
    constructor() {
        super('startRound');
    }

    canChangeGameState({ game }) {
        return game.currentPhase !== 'setup';
    }

    createEvent({ game }) {
        return this.event('onBeginRound', { game }, ({ game }) => {
            game.round++;
            game.addAlert('startofround', 'Round {0}', game.round);
        });
    }
}

export default new StartRound();
