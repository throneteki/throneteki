import GameAction from './GameAction.js';
import Message from '../Message.js';
import TextHelper from '../TextHelper.js';

class DiscardToken extends GameAction {
    constructor() {
        super('discardToken');
    }

    message({ card, token, amount = 1 }) {
        return Message.fragment('discards {tokens} from {card}', {
            tokens: TextHelper.count(Math.min(amount, card.tokens[token] || 0), `${token} token`),
            card
        });
    }

    resultMessage(props, event) {
        return this.hasResult(event)
            ? Message.fragment('discards {tokens} from {card}', {
                  tokens: TextHelper.count(event.amount, `${event.token} token`),
                  card: event.card
              })
            : '';
    }

    canChangeGameState({ card, token, amount = 1 }) {
        return (
            ['active plot', 'agenda', 'play area', 'shadows', 'title'].includes(card.location) &&
            amount > 0 &&
            card.hasToken(token)
        );
    }

    createEvent({ card, token, amount = 1 }) {
        const actualAmount = Math.min(amount, card.tokens[token]);
        const isFullyResolved = (event) => event.amount === event.desiredAmount;
        return this.event(
            'onTokenDiscarded',
            { card, token, amount: actualAmount, desiredAmount: amount, isFullyResolved },
            (event) => {
                event.card.modifyToken(event.token, -event.amount);
            }
        );
    }
}

export default new DiscardToken();
