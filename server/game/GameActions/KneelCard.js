const GameAction = require('./GameAction');

class KneelCard extends GameAction {
    constructor() {
        super('kneel');
    }

    canChangeGameState({ card }) {
        return ['faction', 'play area'].includes(card.location) && !card.kneeled;
    }

    createEvent({ card, source, cause }) {
        return this.event('onCardKneeled', { card: card, source: source, cause: cause }, event => {
            event.card.kneeled = true;
        });
    }
}

module.exports = new KneelCard();
