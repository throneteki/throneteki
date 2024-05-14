import BaseAbility from '../baseability.js';
import Costs from '../costs.js';

class SetupInShadowsAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game',
            cost: [Costs.payGold(2)]
        });
        this.title = 'Setup in shadows';
    }

    meetsRequirements(context) {
        return (
            context.player.readyToStart &&
            context.game.currentPhase === 'setup' &&
            context.source.location === 'hand' &&
            context.source.isShadow()
        );
    }

    executeHandler(context) {
        context.player.putIntoShadows(context.source);
    }
}

export default SetupInShadowsAction;
