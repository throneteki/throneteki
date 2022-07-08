const GameAction = require('./GameAction');

class GainGold extends GameAction {
    constructor() {
        super('gainGold');
    }

    canChangeGameState({ player, amount }) {
        return amount > 0 && player.getGoldToGain(amount) > 0;
    }

    createEvent({ player, amount }) {
        let actualAmount = player.getGoldToGain(amount);
        const isFullyResolved = event => event.amount === event.desiredAmount;
        return this.event('onGoldGained', { player, amount: actualAmount, desiredAmount: amount, isFullyResolved }, event => {
            event.player.gainedGold += event.amount;

            event.player.modifyGold(event.amount);
        });
    }
}

module.exports = new GainGold();
