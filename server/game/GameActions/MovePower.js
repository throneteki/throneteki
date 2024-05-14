const GameAction = require('./GameAction');

class MovePower extends GameAction {
    constructor() {
        super('movePower');
    }

    isImmune({ from, context }) {
        super.isImmune({ card: from, context });
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

module.exports = new MovePower();
