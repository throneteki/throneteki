import GameAction from './GameAction.js';
import Message from '../Message.js';

class SaveCard extends GameAction {
    constructor() {
        super('save');
    }

    message({ event }) {
        return Message.fragment('saves {card}', { card: event.card });
    }

    canChangeGameState({ event }) {
        return (
            !!event &&
            !event.cancelled &&
            event.allowSave !== false &&
            !!event.card &&
            event.card.canBeSaved()
        );
    }

    createEvent({ event }) {
        return this.event('onCardSaved', { card: event.card }, (saveEvent) => {
            saveEvent.card.markAsSaved();
            if (typeof event.removeCard === 'function') {
                event.removeCard(saveEvent.card);
            } else {
                event.cancel();
            }
        });
    }
}

export default new SaveCard();
