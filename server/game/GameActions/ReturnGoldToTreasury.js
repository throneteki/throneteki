const GameAction = require('./GameAction');

class ReturnGoldToTreasury extends GameAction {
    constructor() {
        super('returnGoldToTreasury');
    }

    canChangeGameState({ player, amount = 1 }) {
        return amount > 0 && player.gold > 0;
    }

    createEvent({ player, amount = 1 }) {
        let appliedGold = Math.min(player.gold, amount);
        const isFullyResolved = (event) => event.amount === event.desiredAmount;
        return this.event(
            'onGoldReturned',
            { player, amount: appliedGold, desiredAmount: amount, isFullyResolved },
            (event) => {
                event.player.modifyGold(-event.amount);
            }
        );
    }
}

module.exports = new ReturnGoldToTreasury();
