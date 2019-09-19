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
        return this.event('onGoldGained', { player, amount: actualAmount, desiredAmount: amount }, event => {
            event.player.gainedGold += event.amount;

            event.player.modifyGold(event.amount);
        });
    }
}

module.exports = new GainGold();
