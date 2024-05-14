const BaseAbility = require('../baseability');
const Costs = require('../costs');

class SetupCardAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game',
            cost: [Costs.payPrintedGoldCost(), Costs.playLimited()]
        });
        this.title = 'Setup';
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
