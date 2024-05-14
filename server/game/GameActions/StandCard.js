const Message = require('../Message');
const GameAction = require('./GameAction');

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

module.exports = new StandCard();
