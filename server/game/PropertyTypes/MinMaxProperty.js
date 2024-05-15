class MinMaxProperty {
    constructor(options) {
        this.minValues = [];
        this.maxValues = [];
        this.defaultMin = options.defaultMin;
        this.defaultMax = options.defaultMax;
    }

    setMin(value) {
        this.minValues.push(value);
    }

    removeMin(value) {
        let index = this.minValues.indexOf(value);
        if (index !== -1) {
            this.minValues.splice(index, 1);
        }
    }

    setMax(value) {
        this.maxValues.push(value);
    }

    removeMax(value) {
        let index = this.maxValues.indexOf(value);
        if (index !== -1) {
            this.maxValues.splice(index, 1);
        }
    }

    getMin() {
        if (this.minValues.length === 0) {
            return this.defaultMin;
        }

        return Math.max(...this.minValues);
    }

    getMax() {
        if (this.maxValues.length === 0) {
            return this.defaultMax;
        }

        return Math.min(...this.maxValues);
    }
}

export default MinMaxProperty;
