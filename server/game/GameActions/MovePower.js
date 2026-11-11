import GameAction from './GameAction.js';
import Message from '../Message.js';

class MovePower extends GameAction {
    constructor() {
        super('movePower');
    }

    isImmune({ from, context }) {
        super.isImmune({ card: from, context });
    }

    message({ from, to, amount = 1 }) {
        return Message.fragment('moves {amount} power from {from} to {to}', {
            amount: Math.min(from.power, amount),
            from,
            to
        });
    }

    resultMessage(props, event) {
        return this.hasResult(event)
            ? Message.fragment('moves {amount} power from {from} to {to}', {
                  amount: event.power,
                  from: event.source,
                  to: event.target
              })
            : '';
    }

    canChangeGameState({ from, to, amount = 1 }) {
        return (
            amount > 0 &&
            from.power > 0 &&
            ['active plot', 'faction', 'play area'].includes(from.location) &&
            ['active plot', 'faction', 'play area'].includes(to.location)
        );
    }

    createEvent({ from, to, amount = 1 }) {
        let appliedPower = Math.min(from.power, amount);
        return this.event(
            'onCardPowerMoved',
            { source: from, target: to, power: appliedPower },
            (event) => {
                event.source.power -= appliedPower;
                event.target.power += appliedPower;
            }
        );
    }
}

export default new MovePower();
