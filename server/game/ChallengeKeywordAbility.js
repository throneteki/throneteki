import BaseAbility from './baseability.js';

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

    meetsRequirements(context) {
        return (
            context.source.hasKeyword(this.title) &&
            context.source.allowGameAction(this.title, context) &&
            this.meetsKeywordRequirements(context) &&
            this.getTriggerAmount(context) > 0
        );
    }
}

export default ChallengeKeywordAbility;
