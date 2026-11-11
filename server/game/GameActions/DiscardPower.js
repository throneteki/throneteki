import GameAction from './GameAction.js';
import Message from '../Message.js';

class DiscardPower extends GameAction {
    constructor() {
        super('discardPower');
    }

    message({ card, amount = 1 }) {
        return Message.fragment('discards {amount} from {card}', {
            amount: `${Math.min(card.power, amount)} power`,
            card
        });
    }

    resultMessage(props, event) {
        return this.hasResult(event)
            ? Message.fragment('discards {amount} from {card}', {
                  amount: `${event.power} power`,
                  card: event.card
              })
            : '';
    }

    canChangeGameState({ card }) {
        return ['active plot', 'faction', 'play area'].includes(card.location) && card.power > 0;
    }

    createEvent({ card, amount = 1 }) {
        let finalAmount = Math.min(card.power, amount);

        return this.event('onCardPowerDiscarded', { card, power: finalAmount }, (event) => {
            event.card.power -= event.power;
        });
    }
}

export default new DiscardPower();
