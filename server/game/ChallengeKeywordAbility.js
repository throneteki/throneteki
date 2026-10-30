import BaseAbility from './baseability.js';
import { Requirements } from './Constants/index.js';

class ChallengeKeywordAbility extends BaseAbility {
    constructor(title, properties) {
        super(properties);
        this.title = title;
        this.baseTriggerAmount = 1;
        this.orderBy = false;
    }

    defaultTargetPromptTitle(context) {
        let keyword = this.title.toLowerCase();
        let numTargets = this.getTriggerAmount(context);
        return `Select ${numTargets === 1 ? `${keyword} target` : `up to ${numTargets} ${keyword} targets`} for ${context.source.name}`;
    }

    getTriggerAmount(context) {
        return this.baseTriggerAmount + context.source.getKeywordTriggerModifier(this.title);
    }

    meetsKeywordRequirements() {
        return true;
    }

    getUnmetRequirement(context) {
        if (!context.source.hasKeyword(this.title) || !this.meetsKeywordRequirements(context)) {
            return Requirements.condition;
        }

        if (!context.source.allowGameAction(this.title.toLowerCase(), context)) {
            return Requirements.cannotTrigger;
        }

        if (this.getTriggerAmount(context) <= 0) {
            return Requirements.noEffect;
        }

        return undefined;
    }
}

export default ChallengeKeywordAbility;
