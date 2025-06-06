import Restriction from './restriction.js';

class CannotRestriction extends Restriction {
    constructor(type, condition) {
        super('cannot');
        this.type = type;
        this.condition = condition;
    }

    isMatch(type, abilityContext) {
        return this.type === type && this.checkCondition(abilityContext);
    }

    checkCondition(context) {
        if (!this.condition) {
            return true;
        }

        return this.condition(context);
    }
}

export default CannotRestriction;
