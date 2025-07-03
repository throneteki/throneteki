class XValueDefinition {
    constructor({ max, min, value }) {
        this.maxFunc = max;
        this.minFunc = min;
        this.valueFunc = value;
    }

    needsChoice() {
        return !this.valueFunc;
    }

    getMinValue(context) {
        if (this.valueFunc) {
            return this.valueFunc(context);
        }

        return this.minFunc(context);
    }

    getMaxValue(context) {
        if (this.valueFunc) {
            return this.valueFunc(context);
        }

        return this.maxFunc(context);
    }
}

export default XValueDefinition;
