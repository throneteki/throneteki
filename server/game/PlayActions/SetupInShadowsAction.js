import BaseAbility from '../baseability.js';
import { Requirements } from '../Constants/index.js';

class SetupInShadowsAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game'
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

        if (!context.player.readyToStart || context.player.setup) {
            return Requirements.player;
        }

        if (!context.source.isShadow()) {
            return Requirements.condition;
        }

        if (context.source.location !== 'hand') {
            return Requirements.location;
        }

        const placement = context.player.getSetupPlacement({ inShadows: [context.source] });
        if (placement.cost > context.player.setupGold) {
            return Requirements.cost;
        }

        return undefined;
    }

    executeHandler(context) {
        context.player.putIntoShadows(context.source);
    }
}

export default SetupInShadowsAction;
