const SetupPhase = require('./setupphase');
const PlotPhase = require('./plotphase');
const DrawPhase = require('./drawphase');
const MarshalingPhase = require('./marshalingphase');
const ChallengePhase = require('./challengephase');
const DominancePhase = require('./dominancephase');
const StandingPhase = require('./standingphase');
const TaxationPhase = require('./taxationphase');

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

module.exports = new Phases();
