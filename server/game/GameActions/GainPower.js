const GameAction = require('./GameAction');

class GainPower extends GameAction {
    constructor() {
        super('gainPower');
    }

    canChangeGameState({ card }) {
        return ['faction', 'play area'].includes(card.location);
    }

    createEvent({ card, amount = 1 }) {
        return this.event('onCardPowerGained', { card, power: amount }, event => {
            event.card.power += event.power;
            event.card.game.checkWinCondition(event.card.controller);
        });
    }
}

module.exports = new GainPower();
