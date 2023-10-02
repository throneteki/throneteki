const GameAction = require('./GameAction');

class KneelCard extends GameAction {
    constructor() {
        super('kneel');
    }

    canChangeGameState({ card }) {
        return ['faction', 'play area'].includes(card.location) && !card.kneeled;
    }

    createEvent({ card, reason = 'ability', source }) {
        return this.event('onCardKneeled', { card, source, reason }, event => {
            event.card.kneeled = true;
        });
    }
}

module.exports = new KneelCard();
