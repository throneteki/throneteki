import SatisfyClaim from '../gamesteps/challenge/SatisfyClaim.js';
import GameAction from './GameAction.js';

/**
 * Satisfies a claim as part of a claim that is already being applied, so it raises no new
 * "when claim is applied" timing point.
 */
class SatisfyClaimAction extends GameAction {
    constructor() {
        super('satisfyClaim');
    }

    createEvent({ claim, game }) {
        return this.event('__PLACEHOLDER_EVENT__', {}, (event) => {
            game.queueStep(new SatisfyClaim(game, claim, event));
        });
    }
}

export default new SatisfyClaimAction();
