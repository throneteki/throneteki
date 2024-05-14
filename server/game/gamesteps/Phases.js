import SetupPhase from './setupphase.js';
import PlotPhase from './plotphase.js';
import DrawPhase from './drawphase.js';
import MarshalingPhase from './marshalingphase.js';
import ChallengePhase from './challengephase.js';
import DominancePhase from './dominancephase.js';
import StandingPhase from './standingphase.js';
import TaxationPhase from './taxationphase.js';

class Phases {
    constructor() {
        this.nameToStepIndex = {
            setup: SetupPhase,
            plot: PlotPhase,
            draw: DrawPhase,
            marshal: MarshalingPhase,
            challenge: ChallengePhase,
            dominance: DominancePhase,
            standing: StandingPhase,
            taxation: TaxationPhase
        };
    }

    names() {
        return ['plot', 'draw', 'marshal', 'challenge', 'dominance', 'standing', 'taxation'];
    }

    createStep(name, game) {
        let stepClass = this.nameToStepIndex[name];

        return new stepClass(game);
    }
}

export default new Phases();
