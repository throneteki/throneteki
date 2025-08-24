import Phase from './phase.js';
import ActionWindow from './actionwindow.js';
import DetermineDominance from './DetermineDominance.js';

class DominancePhase extends Phase {
    constructor(game) {
        super(game, 'dominance');
        this.initialise([
            new DetermineDominance(this.game, 'dominance phase'),
            new ActionWindow(this.game, 'After dominance determined', 'dominance')
        ]);
    }
}

export default DominancePhase;
