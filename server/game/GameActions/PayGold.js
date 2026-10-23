import GameAction from './GameAction.js';
import Message from '../Message.js';
import ChooseGoldSourceAmounts from '../gamesteps/ChooseGoldSourceAmounts.js';

class PayGold extends GameAction {
    constructor() {
        super('payGold');
    }

    message({ amount }) {
        return Message.fragment('pays {amount} gold', { amount });
    }

    canChangeGameState({ player, amount, context }) {
        const activePlayer = (context && context.player) || player;
        return (
            amount > 0 &&
            player.getSpendableGold({ player, activePlayer, playingType: 'ability' }) >= amount
        );
    }

    createEvent({ player, amount, context }) {
        const activePlayer = (context && context.player) || player;
        return this.event('onGoldPaid', { player, amount }, (event) => {
            event.player.game.queueStep(
                new ChooseGoldSourceAmounts(
                    event.player.game,
                    {
                        amount: event.amount,
                        player: event.player,
                        activePlayer,
                        playingType: 'ability'
                    },
                    () => true
                )
            );
        });
    }
}

export default new PayGold();
