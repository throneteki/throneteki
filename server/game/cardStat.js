class CardStat {
    constructor(printedValue) {
        this.printedValue = printedValue;
        this.baseValue = this.printedValue;
        this.modifiers = [];
        // TODO: Improve modifiers so that other cards apply a "PlotStatModifier" which is collected here & used in calculate
        //       Would make affecting that modified stat (eg. Rains of Autumn) much simpler
        this._modifier = 0;
        this.setValues = [];
        this.multipliers = [];
    }

    calculate(boostValue = 0) {
        if (this.setValues.length == 0) {
            let modifiedValue = this._modifier + this.baseValue + boostValue;
            let multipliedValue = Math.round(this.multiplier * modifiedValue);
            return Math.max(0, multipliedValue);
        }
        return this.setValue;
    }

    get setValue() {
        if (this.setValues.length == 0) {
            return undefined;
        } else {
            return this.setValues[this.setValues.length - 1].val;
        }
    }

    set modifier(value) {
        this._modifier = value;
    }

    get modifier() {
        return this._modifier;
    }

    get multiplier() {
        return this.multipliers.reduce((acc, curr) => acc * curr.val, 1);
    }

    addMultiplier(source, newValue) {
        this.multipliers.push({ source: source, val: newValue });
    }

    removeMultiplier(source) {
        this.multipliers = this.multipliers.filter((record) => record.source != source);
    }

    addSetValue(source, newValue) {
        this.setValues.push({ source: source, val: newValue });
    }

    removeSetValue(source) {
        this.setValues = this.setValues.filter((record) => record.source != source);
    }

    clone() {
        let clonedStat = new CardStat(this.printedValue);
        clonedStat.modifier = this._modifier;
        this.multipliers.forEach((mult) => clonedStat.addSetValue(mult.source, mult.val));
        this.setValues.forEach((setVal) => clonedStat.addSetValue(setVal.source, setVal.val));
        return clonedStat;
    }
}
export default CardStat;
