const BaseAbility = require('./baseability.js');

class KeywordAbility extends BaseAbility {
    constructor(title, properties) {
        super(properties);
        this.title = title;
        this.baseTriggerAmount = 1;
    }

    defaultTargetPromptTitle(context) {
        var keyword = this.title.toLowerCase();
        var numTargets = this.getTriggerAmount(context);
        return `Select ${numTargets === 1 ? `${keyword} target` : `up to ${numTargets} ${keyword} targets`} for ${context.source.name}`;
    }

    getTriggerAmount(context) {
        return this.baseTriggerAmount + context.source.getKeywordTriggerModifier(this.title);
    }
}

module.exports = KeywordAbility;
