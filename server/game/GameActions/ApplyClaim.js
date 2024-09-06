import SatisfyClaim from '../gamesteps/challenge/SatisfyClaim.js';
import GameAction from './GameAction.js';

class ApplyClaim extends GameAction {
    constructor() {
        super('applyClaim');
    }

    createEvent({ player, challenge, claim, game }) {
        return this.event('onClaimApplied', { player, challenge, claim }, (event) => {
            // TODO: Move "SatisfyClaim" logic into here, properly.
            game.queueStep(new SatisfyClaim(game, event.claim));
        });
    }
}

export default new ApplyClaim();
