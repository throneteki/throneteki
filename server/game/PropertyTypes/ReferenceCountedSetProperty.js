class ReferenceCountedSetProperty {
    constructor() {
        this.referenceCounts = new Map();
    }

    add(value) {
        const normalizedValue = this.normalizeValue(value);
        let currentCount = this.referenceCounts.get(normalizedValue) || 0;
        this.referenceCounts.set(normalizedValue, currentCount + 1);
    }

    remove(value) {
        const normalizedValue = this.normalizeValue(value);
        let currentCount = this.referenceCounts.get(normalizedValue) || 0;
        this.referenceCounts.set(normalizedValue, currentCount - 1);
    }

    contains(value) {
        const normalizedValue = this.normalizeValue(value);
        let currentCount = this.referenceCounts.get(normalizedValue) || 0;
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
        const normalizedValue = this.normalizeValue(value);
        let currentCount = this.referenceCounts.get(normalizedValue) || 0;
        return currentCount;
    }

    normalizeValue(value) {
        if (typeof value === 'symbol') {
            return value;
        }

        return value.toLowerCase();
    }
}

export default ReferenceCountedSetProperty;
