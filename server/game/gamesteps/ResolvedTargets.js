const _ = require('underscore');

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
        return this.selections.length === 1;
    }

    hasTargets() {
        return this.selections.length !== 0;
    }

    getTargets() {
        return _.flatten(this.selections.map(selection => selection.value));
    }
}

module.exports = ResolvedTargets;
