import GameAction from './GameAction.js';
import MoveCardEventGenerator from './MoveCardEventGenerator.js';

class LeavePlay extends GameAction {
    constructor() {
        super('leavePlay');
    }

    canChangeGameState({ card }) {
        return ['active plot', 'faction', 'play area', 'title'].includes(card.location);
    }

    createEvent({ card, allowSave = false }) {
        return MoveCardEventGenerator.createLeavePlayEvent({ card, allowSave });
    }
}

export default new LeavePlay();
