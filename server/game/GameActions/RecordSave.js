import GameAction from './GameAction.js';

class RecordSave extends GameAction {
    constructor() {
        super('save');
    }

    canChangeGameState({ card }) {
        return !!card && card.canBeSaved();
    }

    createEvent({ card, event }) {
        return this.event('onCardSaved', { card }, (saveEvent) => {
            saveEvent.card.markAsSaved();
            if (typeof event?.removeCard === 'function') {
                event.removeCard(saveEvent.card);
            } else if (event) {
                event.cancel();
            }
        });
    }
}

export default new RecordSave();
