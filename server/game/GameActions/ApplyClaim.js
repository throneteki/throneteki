import SatisfyClaim from '../gamesteps/challenge/SatisfyClaim.js';
import GameAction from './GameAction.js';

class ApplyClaim extends GameAction {
    constructor() {
        super('applyClaim');
    }

    createEvent({ player, challenge, claim, game }) {
        return this.event('onClaimApplied', { player, challenge, claim }, (event) => {
            game.queueStep(new SatisfyClaim(game, event.claim, event));
        });
    }
}

export default new ApplyClaim();
