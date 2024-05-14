import BaseStep from './basestep.js';
import GamePipeline from '../gamepipeline.js';
import SimpleStep from './simplestep.js';
import EndPhase from '../GameActions/EndPhase.js';

class Phase extends BaseStep {
    constructor(game, name) {
        super(game);
        this.name = name;
        this.pipeline = new GamePipeline();
    }

    initialise(steps) {
        var startStep = new SimpleStep(this.game, () => this.startPhase());
        var endStep = new SimpleStep(this.game, () => this.endPhase());
        this.pipeline.initialise([startStep].concat(steps).concat([endStep]));
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method, promptId) {
        return this.pipeline.handleMenuCommand(player, arg, method, promptId);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        return this.game.isPhaseSkipped(this.name) || this.pipeline.continue();
    }

    startPhase() {
        this.game.currentPhase = this.name;

        this.game.raiseEvent('onPhaseStarted', { phase: this.name });
        this.game.addAlert('phasestart', '{0} phase', this.name);
    }

    endPhase() {
        this.game.resolveGameAction(EndPhase, { game: this.game });
    }
}

export default Phase;
