import ReferenceCountedSetProperty from './ReferenceCountedSetProperty.js';

class KeywordsProperty {
    constructor() {
        this.data = new ReferenceCountedSetProperty();
        this.triggerAmountModifiers = new Map();
    }

    add(value) {
        this.data.add(value);
    }

    remove(value) {
        this.data.remove(value);
    }

    contains(value) {
        return this.data.contains(value);
    }

    getCount(value) {
        return this.data.getCountForReference(value);
    }

    getValues() {
        return this.data.getValues();
    }

    size() {
        return this.data.size();
    }

    clone() {
        let cloned = new KeywordsProperty();
        cloned.data = this.data.clone();
        cloned.triggerAmountModifiers = new Map(this.triggerAmountModifiers);
        return cloned;
    }

    getRequiredAttachmentTraits() {
        return this.requiredAttachmentTraits;
    }

    getAmbushCost() {
        return this.ambushCost;
    }

    getBestowMax() {
        return this.bestowMax;
    }

    getShadowCost() {
        return this.shadowCost;
    }

    getPrizedValue() {
        return this.prizedValue || 0;
    }

    get requiredAttachmentTraits() {
        return this.parseAttachmentTraits();
    }

    get ambushCosts() {
        return this.parseNumericValues('ambush');
    }

    get bestowMaxes() {
        return this.parseNumericValues('bestow');
    }

    get shadowCosts() {
        return this.parseNumericValues('shadow');
    }

    get prizedValues() {
        return this.parseNumericValues('prized');
    }

    get ambushCost() {
        return this.safeReduce(this.ambushCosts, Math.min);
    }

    get bestowMax() {
        return this.safeReduce(this.bestowMaxes, Math.max);
    }

    get shadowCost() {
        // A printed Shadow (X) always takes priority over any granted shadows amounts,
        // as the X value is likely required to interact with the card itself
        const costs = this.shadowCosts;
        return costs.includes('X') ? 'X' : this.safeReduce(costs, Math.min);
    }

    get prizedValue() {
        return this.prizedValues.reduce((sum, value) => sum + value, 0);
    }

    parseAttachmentTraits() {
        const pattern = /no attachments except <[bi]>(.*)<\/[bi]>/;
        let values = this.getValues().filter((keyword) => keyword.indexOf('no attachments') === 0);

        return values.map((value) => {
            let match = value.match(pattern);
            return match ? match[1] : 'none';
        });
    }

    parseNumericValues(keywordName) {
        let pattern = `${keywordName} \\(?(\\w+)\\)?`;
        let matches = this.data.getValues().map((keyword) => keyword.match(pattern));

        return matches
            .filter((match) => !!match)
            .map((match) => {
                if (match[1] === 'x') {
                    return 'X';
                }

                return isNaN(match[1]) ? 0 : parseInt(match[1]);
            });
    }

    safeReduce(values, func) {
        if (values.length === 0) {
            return;
        }

        return values.reduce((a, b) => func(a, b));
    }

    modifyTriggerAmount(value, amount) {
        let lowerCaseValue = value.toLowerCase();
        let currentModifier = this.triggerAmountModifiers.get(lowerCaseValue) || 0;
        this.triggerAmountModifiers.set(lowerCaseValue, currentModifier + amount);
    }

    getTriggerModifier(value) {
        let lowerCaseValue = value.toLowerCase();
        let currentModifier = this.triggerAmountModifiers.get(lowerCaseValue) || 0;
        return currentModifier;
    }
}

export default KeywordsProperty;
