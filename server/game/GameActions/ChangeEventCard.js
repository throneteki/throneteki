import GameAction from './GameAction.js';

class ChangeEventCard extends GameAction {
    constructor() {
        super('changeEventCard');
    }

    canChangeGameState({ event, card }) {
        return !!event && !event.cancelled && !!card;
    }

    createEvent({ event, card }) {
        return this.event('__PLACEHOLDER_EVENT__', {}, () => {
            event.card = card;
            event.params.card = card;
            event.cardStateWhenEventCreated = card.createSnapshot();
        });
    }
}

export default new ChangeEventCard();
