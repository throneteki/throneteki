import GameAction from './GameAction.js';
import Message from '../Message.js';

class GainPower extends GameAction {
    constructor() {
        super('gainPower');
    }

    message({ card, amount = 1, context }) {
        if (card.getType() === 'faction') {
            return Message.fragment(
                `gains {amount} power on ${context.player !== card.controller ? "{player}'s" : 'their'} faction card`,
                { amount, player: card.controller }
            );
        }

        return Message.fragment('gains {amount} power on {card}', { amount, card });
    }

    canChangeGameState({ card, amount = 1 }) {
        return ['active plot', 'faction', 'play area'].includes(card.location) && amount > 0;
    }

    createEvent({ card, amount = 1, reason = 'ability' }) {
        return this.event('onCardPowerGained', { card, power: amount, reason }, (event) => {
            event.card.power += event.power;
        });
    }
}

export default new GainPower();
