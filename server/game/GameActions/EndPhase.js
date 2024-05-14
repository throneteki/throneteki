import GameAction from './GameAction.js';

class EndPhase extends GameAction {
    constructor() {
        super('endPhase');
    }

    canChangeGameState({ game }) {
        return game.currentPhase !== '';
    }

    createEvent({ game }) {
        const phase = game.currentPhase;
        return this.event('onPhaseEnded', { phase }, (event) => {
            game.currentPhase = '';

            event.thenAttachEvent(this.event('onAtEndOfPhase', { phase }));
        });
    }
}

export default new EndPhase();
