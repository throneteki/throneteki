const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class SetupCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payPrintedGoldCost(),
                Costs.playLimited()
            ]
        });
        this.title = 'Setup';
    }

    isCardAbility() {
        return false;
    }

    meetsRequirements(context) {
        return (
            context.player.readyToStart &&
            context.game.currentPhase === 'setup' &&
            context.player.hand.includes(context.source) &&
            context.source.getType() !== 'event'
        );
    }

    executeHandler(context) {
        context.player.putIntoPlay(context.source, 'setup');
    }
}

module.exports = SetupCardAction;
