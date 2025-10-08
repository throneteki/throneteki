import GameAction from './GameAction.js';
import Message from '../Message.js';

class GainPower extends GameAction {
    constructor() {
        super('gainPower');
    }

    message({ card, amount = 1, context }) {
        const actualAmount = card.getPowerToGain(amount);
        if (card.getType() === 'faction') {
            return Message.fragment(
                `gains {amount} power on ${context.player !== card.controller ? "{player}'s" : 'their'} faction card`,
                { amount: actualAmount, player: card.controller }
            );
        }

        return Message.fragment('gains {amount} power on {card}', { amount: actualAmount, card });
    }

    canChangeGameState({ card, amount = 1 }) {
        const actualAmount = card.getPowerToGain(amount);
        return ['active plot', 'faction', 'play area'].includes(card.location) && actualAmount > 0;
    }

    createEvent({ card, amount = 1, reason = 'ability' }) {
        const actualAmount = card.getPowerToGain(amount);
        return this.event('onCardPowerGained', { card, power: actualAmount, reason }, (event) => {
            event.card.controller.gainedPower += event.power;
            event.card.power += event.power;
        });
    }
}

export default new GainPower();
