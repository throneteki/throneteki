class ReferenceCountedSetProperty {
    constructor() {
        this.referenceCounts = new Map();
    }

    add(value) {
        let lowerCaseValue = value.toLowerCase();
        let currentCount = this.referenceCounts.get(lowerCaseValue) || 0;
        this.referenceCounts.set(lowerCaseValue, currentCount + 1);
    }

    remove(value) {
        let lowerCaseValue = value.toLowerCase();
        let currentCount = this.referenceCounts.get(lowerCaseValue) || 0;
        this.referenceCounts.set(lowerCaseValue, currentCount - 1);
    }

    contains(value) {
        let lowerCaseValue = value.toLowerCase();
        let currentCount = this.referenceCounts.get(lowerCaseValue) || 0;
        return currentCount > 0;
    }

    getValues() {
        let values = [];

        for (let [value, count] of this.referenceCounts) {
            if (count > 0) {
                values.push(value);
            }
        }

        return values;
    }

    clear() {
        this.referenceCounts.clear();
    }

    size() {
        let size = 0;

        for (let count of this.referenceCounts.values()) {
            if (count > 0) {
                size += 1;
            }
        }

        return size;
    }

    clone() {
        let clonedSet = new ReferenceCountedSetProperty();
        clonedSet.referenceCounts = new Map(this.referenceCounts);
        return clonedSet;
    }

    getCountForReference(value) {
        let lowerCaseValue = value.toLowerCase();
        let currentCount = this.referenceCounts.get(lowerCaseValue) || 0;
        return currentCount;
    }
}

module.exports = ReferenceCountedSetProperty;
