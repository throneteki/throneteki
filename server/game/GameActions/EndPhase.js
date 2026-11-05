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
        game.beginEndingDuration('untilEndOfPhase');
        return this.event('onPhaseEnded', { phase }, (event) => {
            game.effectEngine.unapplyAndRemove((effect) => effect.duration === 'untilEndOfPhase');
            game.effectEngine.expireDelayedEffects('untilEndOfPhase');
            game.currentPhase = '';

            event.thenAttachEvent(this.event('onAtEndOfPhase', { phase }));
        });
    }
}

export default new EndPhase();
