const _ = require('underscore');

/**
 * Encapsulates logic around what targets have been selected during resolution
 * of an ability.
 */
class ResolvedTargets {
    constructor() {
        this.selections = [];
    }

    anySelection(predicate) {
        return this.selections.some(predicate);
    }

    setSelections(selections) {
        this.selections = selections || [];
    }

    updateTargets() {
        for(let selection of this.selections) {
            this[selection.name] = selection.value;
            if(selection.name === 'target') {
                this.defaultTarget = selection.value;
            }
        }
    }

    hasSingleTarget() {
        return this.selections.length === 1 && this.selections[0].targetingType === 'choose' && !Array.isArray(this.selections[0].value);
    }

    hasTargets() {
        return this.selections.length !== 0;
    }

    getTargets() {
        let targetingSelections = this.selections.filter(selection => selection.targetingType === 'choose');
        return _.flatten(targetingSelections.map(selection => selection.value));
    }
}

module.exports = ResolvedTargets;
