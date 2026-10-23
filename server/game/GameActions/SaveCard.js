import GameAction from './GameAction.js';
import Message from '../Message.js';

class SaveCard extends GameAction {
    constructor() {
        super('save');
    }

    message({ event }) {
        return Message.fragment('saves {card}', { card: event.card });
    }

    // A burn kill can only be saved from by a save that takes the character above 0 STR (FAQ 3.1).
    canChangeGameState({ event, remediesBurn = false }) {
        return (
            !!event &&
            !event.cancelled &&
            (event.allowSave !== false || (remediesBurn && !!event.isBurn)) &&
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
