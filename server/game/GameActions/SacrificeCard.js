import GameAction from './GameAction.js';
import Message from '../Message.js';
import MoveCardEventGenerator from './MoveCardEventGenerator.js';
import LeavePlay from './LeavePlay.js';

class SacrificeCard extends GameAction {
    constructor() {
        super('sacrifice');
    }

    message({ card }) {
        return Message.fragment('sacrifices {card}', { card });
    }

    canChangeGameState({ card }) {
        return card.location === 'play area' && LeavePlay.allow({ card });
    }

    createEvent({ card, player }) {
        return MoveCardEventGenerator.createSacrificeCardEvent({ card, player });
    }
}

export default new SacrificeCard();
