import GameAction from './GameAction.js';

class FinishSetup extends GameAction {
    constructor() {
        super('finishSetup');
    }

    createEvent({ game }) {
        return this.event('onSetupFinished', {}, () => {
            for (const player of game.getPlayers()) {
                player.revealSetupCards();
            }
        });
    }
}

export default new FinishSetup();
