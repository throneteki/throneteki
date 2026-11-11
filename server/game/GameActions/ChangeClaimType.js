import GameAction from './GameAction.js';

/**
 * "Apply X claim instead": changes the claim type of a pending onClaimApplied event.
 */
class ChangeClaimType extends GameAction {
    constructor() {
        super('changeClaimType');
    }

    canChangeGameState({ event, challengeType }) {
        return !!event && !event.cancelled && event.claim.challengeType !== challengeType;
    }

    createEvent({ event, challengeType }) {
        return this.event('__PLACEHOLDER_EVENT__', {}, () => {
            event.claim.challengeType = challengeType;
        });
    }
}

export default new ChangeClaimType();
