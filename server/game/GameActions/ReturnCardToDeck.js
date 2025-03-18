import Message from '../Message.js';
import GameAction from './GameAction.js';
import MoveCardEventGenerator from './MoveCardEventGenerator.js';

class ReturnCardToDeck extends GameAction {
    constructor() {
        super('returnCardToDeck');
    }

    message({ card, bottom }) {
        return Message.fragment('places {card} on {position} of their deck', {
            card,
            position: bottom ? 'the bottom' : 'top'
        });
    }

    canChangeGameState({ card }) {
        return card.location !== 'draw deck';
    }

    createEvent({ card, allowSave = true, bottom = false, orderable }) {
        return MoveCardEventGenerator.createReturnCardToDeckEvent({
            card,
            allowSave,
            bottom,
            orderable
        });
    }
}

export default new ReturnCardToDeck();
