class CardStat {
    constructor(printedValue) {
        this.printedValue = printedValue;
        this.baseValue = this.printedValue;
        this.modifiers = [];
        // TODO: Improve modifiers so that other cards apply a "PlotStatModifier" which is collected here & used in calculate
        //       Would make affecting that modified stat (eg. Rains of Autumn) much simpler
        this._modifier = 0;
        this._setValues = [];
        this._multiplier = 1;
    }

    calculate(boostValue = 0) {
        if (this._setValues.length == 0) {
            let modifiedValue = this._modifier + this.baseValue + boostValue;
            let multipliedValue = Math.round(this._multiplier * modifiedValue);
            return Math.max(0, multipliedValue);
        }
        return this.setValue;
    }

    get setValue() {
        if (this._setValues.length == 0) {
            return undefined;
        } else {
            return this._setValues[this._setValues.length - 1].val;
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

    setTheValue(sourceUuid, newValue) {
        this._setValues.push({ source: sourceUuid, val: newValue });
    }

    removeSetEffect(sourceUuid) {
        this._setValues = this._setValues.filter((record) => record.source != sourceUuid);
    }

    clone() {
        let clonedStat = new CardStat(this.printedValue);
        clonedStat.modifier = this._modifier;
        clonedStat.multiplier = this._multiplier;
        this._setValues.forEach((setVal) => clonedStat.setTheValue(setVal.sourceUuid, setVal.val));
        return clonedStat;
    }
}
export default CardStat;
