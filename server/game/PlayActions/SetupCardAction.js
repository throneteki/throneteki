import BaseAbility from '../baseability.js';
import Costs from '../costs.js';
import { Requirements } from '../Constants/index.js';

class SetupCardAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game',
            cost: [Costs.payPrintedGoldCost(), Costs.playLimited()]
        });
        this.title = 'Setup';
    }

    getUnmetRequirement(context) {
        if (context.game.currentPhase !== 'setup') {
            return Requirements.phase;
        }

        if (!context.player.readyToStart) {
            return Requirements.player;
        }

        if (context.source.getType() === 'event') {
            return Requirements.condition;
        }

        if (!context.player.hand.includes(context.source)) {
            return Requirements.location;
        }

        return undefined;
    }

    executeHandler(context) {
        context.player.putIntoPlay(context.source, 'setup');
    }
}

export default SetupCardAction;
