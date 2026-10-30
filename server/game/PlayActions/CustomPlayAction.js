import BaseAbility from '../baseability.js';
import { Requirements } from '../Constants/index.js';

class CustomPlayAction extends BaseAbility {
    constructor(properties) {
        super(properties);
        this.condition = properties.condition || (() => true);
        this.handler = properties.handler;
        this.title = properties.title;
    }

    getUnmetRequirement(context) {
        if (context.game.currentPhase !== 'setup') {
            const timingRequirement = context.game.getActionTimingRequirement(context.player);
            if (timingRequirement) {
                return timingRequirement;
            }
        }

        return this.condition(context) ? undefined : Requirements.condition;
    }

    executeHandler(context) {
        if (!this.handler) {
            super.executeHandler(context);
            return;
        }

        this.handler(context);
    }

    //This classification might need to be reviewed in the future, but with Lady-in-Waiting being the
    //only card making use of this functionality currently, it fits.
    isCardAbility() {
        return false;
    }
}

export default CustomPlayAction;
