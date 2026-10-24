import BaseAbility from '../baseability.js';
import Costs from '../costs.js';
import { Requirements } from '../Constants/index.js';

class SetupInShadowsAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game',
            cost: [Costs.payGold(2)]
        });
        this.title = 'Setup in shadows';
    }

    isRelevant({ game, player, source }) {
        return game.currentPhase === 'setup' && source.isShadow() && player.hand.includes(source);
    }

    getUnmetRequirement(context) {
        if (context.game.currentPhase !== 'setup') {
            return Requirements.phase;
        }

        if (!context.player.readyToStart) {
            return Requirements.player;
        }

        if (!context.source.isShadow()) {
            return Requirements.condition;
        }

        if (context.source.location !== 'hand') {
            return Requirements.location;
        }

        return undefined;
    }

    executeHandler(context) {
        context.player.putIntoShadows(context.source);
    }
}

export default SetupInShadowsAction;
