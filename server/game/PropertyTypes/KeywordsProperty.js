const ReferenceCountedSetProperty = require('./ReferenceCountedSetProperty');

class KeywordsProperty {
    constructor() {
        this.data = new ReferenceCountedSetProperty();
        this.requiredAttachmentTraits = [];
        this.ambushCosts = [];
        this.bestowMaxes = [];
        this.shadowCosts = [];
    }

    add(value) {
        this.data.add(value);
        this.recalculateValues();
    }

    remove(value) {
        this.data.remove(value);
        this.recalculateValues();
    }

    contains(value) {
        return this.data.contains(value);
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
        cloned.recalculateValues();
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

    recalculateValues() {
        this.requiredAttachmentTraits = this.parseAttachmentTraits();
        this.ambushCosts = this.parseNumericValues('ambush');
        this.bestowMaxes = this.parseNumericValues('bestow');
        this.shadowCosts = this.parseNumericValues('shadow');
        this.ambushCost = this.safeReduce(this.ambushCosts, Math.min);
        this.bestowMax = this.safeReduce(this.bestowMaxes, Math.max);
        this.shadowCost = this.safeReduce(this.shadowCosts, Math.min);
    }

    parseAttachmentTraits() {
        const pattern = /no attachments except <[bi]>(.*)<\/[bi]>/;
        let values = this.getValues().filter(keyword => keyword.indexOf('no attachments') === 0);

        return values.map(value => {
            let match = value.match(pattern);
            return match ? match[1] : 'none';
        });
    }

    parseNumericValues(keywordName) {
        let pattern = `${keywordName} \\((\\w+)\\)`;
        let matches = this.data.getValues().map(keyword => keyword.match(pattern));

        return matches.filter(match => !!match).map(match => isNaN(match[1]) ? 0 : parseInt(match[1]));
    }

    safeReduce(values, func) {
        if(values.length === 0) {
            return;
        }

        return values.reduce((a, b) => func(a, b));
    }
}

module.exports = KeywordsProperty;
