import GameAction from './GameAction.js';
import MoveCardEventGenerator from './MoveCardEventGenerator.js';
import Message from '../Message.js';
import LeavePlay from './LeavePlay.js';

class Kill extends GameAction {
    constructor() {
        super('kill');
    }

    message({ card }) {
        return Message.fragment('kills {card}', { card });
    }

    canChangeGameState({ card }) {
        return (
            card.location === 'play area' &&
            card.getType() === 'character' &&
            LeavePlay.allow({ card })
        );
    }

    createEvent({ card, allowSave, isBurn }) {
        return MoveCardEventGenerator.createKillCharacterEvent({ card, allowSave, isBurn });
    }
}

export default new Kill();
