const _ = require('underscore');

class ReferenceCountedSetProperty {
    constructor() {
        this.referenceCounts = {};
    }

    add(value) {
        let lowerCaseValue = value.toLowerCase();
        let currentCount = this.referenceCounts[lowerCaseValue] || 0;
        this.referenceCounts[lowerCaseValue] = currentCount + 1;
    }

    remove(value) {
        let lowerCaseValue = value.toLowerCase();
        let currentCount = this.referenceCounts[lowerCaseValue] || 0;
        this.referenceCounts[lowerCaseValue] = currentCount - 1;
    }

    contains(value) {
        let lowerCaseValue = value.toLowerCase();
        let currentCount = this.referenceCounts[lowerCaseValue] || 0;
        return currentCount > 0;
    }

    getValues() {
        return _.keys(_.omit(this.referenceCounts, count => count < 1));
    }

    size() {
        let values = this.getValues();
        return values.length;
    }

    clone() {
        let clonedSet = new ReferenceCountedSetProperty();
        clonedSet.referenceCounts = _.clone(this.referenceCounts);
        return clonedSet;
    }
}

module.exports = ReferenceCountedSetProperty;
