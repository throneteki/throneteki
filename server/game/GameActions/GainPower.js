const GameAction = require('./GameAction');
const Message = require('../Message');

class GainPower extends GameAction {
    constructor() {
        super('gainPower');
    }

    message({ card, amount }) {
        if(card.getType() === 'faction') {
            return Message.fragment('gains {amount} power on {player}\'s faction card', { amount, player: card.controller });
        }

        return Message.fragment('gains {amount} power on {card}', { amount, card });
    }

    canChangeGameState({ card }) {
        return ['active plot', 'faction', 'play area'].includes(card.location);
    }

    createEvent({ card, amount = 1 }) {
        return this.event('onCardPowerGained', { card, power: amount }, event => {
            event.card.power += event.power;
            event.card.game.checkWinCondition(event.card.controller);
        });
    }
}

module.exports = new GainPower();
