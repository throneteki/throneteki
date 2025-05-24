class CardStat {
    constructor(printedValue) {
        this.printedValue = printedValue;
        this.baseValue = this.printedValue;
        this.modifiers = [];
        // TODO: Improve modifiers so that other cards apply a "PlotStatModifier" which is collected here & used in calculate
        //       Would make affecting that modified stat (eg. Rains of Autumn) much simpler
        this._modifier = 0;
        this.setValues = [];
        this._multiplier = 1;
    }

    calculate(boostValue = 0) {
        if (this.setValues.length == 0) {
            let modifiedValue = this._modifier + this.baseValue + boostValue;
            let multipliedValue = Math.round(this._multiplier * modifiedValue);
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

    set multiplier(value) {
        this._multiplier = value;
    }

    get multiplier() {
        return this._multiplier;
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
        clonedStat.multiplier = this._multiplier;
        this.setValues.forEach((setVal) => clonedStat.addSetValue(setVal.source, setVal.val));
        return clonedStat;
    }
}
export default CardStat;
