import Message from '../Message.js';
import GameAction from './GameAction.js';

class StandCard extends GameAction {
    constructor() {
        super('stand');
    }

    message({ card }) {
        return Message.fragment('stands {card}', { card });
    }

    canChangeGameState({ card }) {
        return ['faction', 'play area'].includes(card.location) && card.kneeled;
    }

    createEvent({ card }) {
        return this.event('onCardStood', { card }, (event) => {
            event.card.kneeled = false;
        });
    }
}

export default new StandCard();
