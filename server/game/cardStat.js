class CardStat {
    constructor(printedValue) {
        this.printedValue = printedValue;
        this.baseValue = this.printedValue;
        this.modifiers = [];
        this.setValues = [];
        this.multipliers = [];
    }

    calculate(boostValue = 0) {
        if (typeof this.setValue !== 'number') {
            let modifiedValue = this.modifier + this.baseValue + boostValue;
            let multipliedValue = Math.round(this.multiplier * modifiedValue);
            return Math.max(0, multipliedValue);
        }
        return this.setValue;
    }

    get setValue() {
        if (this.setValues.length == 0) {
            return null;
        } else {
            return this.setValues[this.setValues.length - 1].val;
        }
    }

    get modifier() {
        return this.modifiers.reduce(
            (accumulatedValue, currentObject) => accumulatedValue + currentObject.val,
            0
        );
    }

    get multiplier() {
        return this.multipliers.reduce(
            (accumulatedValue, currentObject) => accumulatedValue * currentObject.val,
            1
        );
    }

    addModifier(effect, newValue) {
        this.modifiers.push({ effect: effect, val: newValue });
    }

    removeModifier(effect) {
        this.modifiers = this.modifiers.filter((record) => record.effect != effect);
    }

    changeModifier(effect, newValue) {
        this.modifiers
            .filter((record) => record.effect === effect)
            .forEach((record) => (record.val = newValue));
    }

    addMultiplier(effect, newValue) {
        this.multipliers.push({ effect: effect, val: newValue });
    }

    removeMultiplier(effect) {
        this.multipliers = this.multipliers.filter((record) => record.effect != effect);
    }

    addSetValue(effect, newValue) {
        this.setValues.push({ effect: effect, val: newValue });
    }

    removeSetValue(effect) {
        this.setValues = this.setValues.filter((record) => record.effect != effect);
    }

    clone() {
        let clonedStat = new CardStat(this.printedValue);
        this.modifiers.forEach((mod) => clonedStat.addModifier(mod.effect, mod.val));
        this.multipliers.forEach((mult) => clonedStat.addMultiplier(mult.effect, mult.val));
        this.setValues.forEach((setVal) => clonedStat.addSetValue(setVal.effect, setVal.val));
        return clonedStat;
    }
}
export default CardStat;
