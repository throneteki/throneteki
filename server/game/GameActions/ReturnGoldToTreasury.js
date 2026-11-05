import GameAction from './GameAction.js';
import Message from '../Message.js';

class ReturnGoldToTreasury extends GameAction {
    constructor() {
        super('returnGoldToTreasury');
    }

    message({ player, amount = 1, context }) {
        return this.describe(player, Math.min(player.gold, amount), context);
    }

    resultMessage(props, event) {
        return this.hasResult(event)
            ? this.describe(event.player, event.amount, props.context)
            : '';
    }

    describe(player, amount, context) {
        return context && context.player === player
            ? Message.fragment('returns {amount} gold to the treasury', { amount })
            : Message.fragment("returns {amount} of {player}'s gold to the treasury", {
                  amount,
                  player
              });
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

export default new ReturnGoldToTreasury();
