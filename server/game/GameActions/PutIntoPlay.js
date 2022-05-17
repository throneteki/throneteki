const GameAction = require('./GameAction');
const Message = require('../Message');

class PutIntoPlay extends GameAction {
    constructor() {
        super('putIntoPlay');
    }

    message({ card }) {
        return Message.fragment('puts {card} into play', { card });
    }

    canChangeGameState({ player, card }) {
        player = player || card.controller;
        return card.location !== 'play area' && player.canPutIntoPlay(card);
    }

    createEvent({ player, card, kneeled }) {
        player = player || card.controller;
        return this.event('__PLACEHOLDER_EVENT__', { player, card }, event => {
            event.player.putIntoPlay(event.card, 'play', { kneeled });
        });
    }
}

module.exports = new PutIntoPlay();
