import GameAction from './GameAction.js';
import Message from '../Message.js';

class GainGold extends GameAction {
    constructor() {
        super('gainGold');
    }

    message({ player, amount }) {
        const actualAmount = player.getGoldToGain(amount);
        return Message.fragment('gains {actualAmount} gold', { actualAmount });
    }

    canChangeGameState({ player, amount }) {
        return amount > 0 && player.getGoldToGain(amount) > 0;
    }

    createEvent({ player, amount }) {
        let actualAmount = player.getGoldToGain(amount);
        const isFullyResolved = (event) => event.amount === event.desiredAmount;
        return this.event(
            'onGoldGained',
            { player, amount: actualAmount, desiredAmount: amount, isFullyResolved },
            (event) => {
                event.player.gainedGold += event.amount;

                event.player.modifyGold(event.amount);
            }
        );
    }
}

export default new GainGold();
