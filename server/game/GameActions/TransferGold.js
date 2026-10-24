import GameAction from './GameAction.js';
import Message from '../Message.js';
import ChooseGoldSourceAmounts from '../gamesteps/ChooseGoldSourceAmounts.js';

const isPlayer = (target) => target.getGameElementType() === 'player';

class TransferGold extends GameAction {
    constructor() {
        super('transferGold');
    }

    message({ from, to, amount = 1, context, activePlayer }) {
        return Message.fragment('moves {amount} gold from {from} to {to}', {
            amount: this.availableAmount({ from, amount, context, activePlayer }),
            from,
            to
        });
    }

    resultMessage(props, event) {
        return this.hasResult(event)
            ? Message.fragment('moves {amount} gold from {from} to {to}', {
                  amount: event.amount,
                  from: event.source,
                  to: event.target
              })
            : '';
    }

    canChangeGameState({ from, to, amount = 1, context, activePlayer }) {
        return (
            !!to && from !== to && this.availableAmount({ from, amount, context, activePlayer }) > 0
        );
    }

    availableAmount({ from, amount, context, activePlayer }) {
        if (amount <= 0) {
            return 0;
        }

        if (isPlayer(from)) {
            activePlayer = activePlayer || (context && context.player);
            return Math.min(from.getSpendableGold({ player: from, activePlayer }), amount);
        }

        return Math.min(from.gold, amount);
    }

    createEvent({ from, to, amount = 1, context, activePlayer }) {
        activePlayer = activePlayer || (context && context.player);
        return this.event(
            'onGoldTransferred',
            {
                source: from,
                target: to,
                amount: this.availableAmount({ from, amount, context, activePlayer })
            },
            (event) => {
                if (isPlayer(event.source)) {
                    event.source.game.queueStep(
                        new ChooseGoldSourceAmounts(
                            event.source.game,
                            {
                                amount: event.amount,
                                player: event.source,
                                activePlayer,
                                playingType: 'ability'
                            },
                            () => event.target.modifyGold(event.amount)
                        )
                    );
                    return;
                }

                event.source.modifyGold(-event.amount);
                event.target.modifyGold(event.amount);
            }
        );
    }
}

export default new TransferGold();
