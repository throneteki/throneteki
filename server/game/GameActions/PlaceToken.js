const GameAction = require('./GameAction');
const Message = require('../Message');
const TextHelper = require('../TextHelper');
const { Tokens } = require('../Constants');

class PlaceToken extends GameAction {
    constructor() {
        super('placeToken');
    }

    message({ card, token, amount = 1 }) {
        const tokenWord =
            token === Tokens.gold ? `${amount} gold` : TextHelper.count(amount, `${token} token`);
        return Message.fragment('places {tokenWord} on {card}', { tokenWord, card });
    }

    canChangeGameState({ card, amount = 1 }) {
        return (
            ['active plot', 'agenda', 'play area', 'shadows', 'title'].includes(card.location) &&
            amount > 0
        );
    }

    createEvent({ card, token, amount = 1 }) {
        return this.event(
            'onTokenPlaced',
            { card, token, amount, desiredAmount: amount },
            (event) => {
                event.card.modifyToken(event.token, event.amount);
            }
        );
    }
}

module.exports = new PlaceToken();
