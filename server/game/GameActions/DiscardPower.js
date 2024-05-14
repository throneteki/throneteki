const GameAction = require('./GameAction');

class DiscardPower extends GameAction {
    constructor() {
        super('discardPower');
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

module.exports = new DiscardPower();
