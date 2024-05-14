/**
 * Represents a card selected by the player during targeting
 */
class AbilityChoiceSelection {
    constructor(options) {
        this.choosingPlayer = options.choosingPlayer;
        this.eligibleChoices = options.eligibleChoices;
        this.requiresValidation = options.requiresValidation;
        this.targetingType = options.targetingType;
        this.name = options.name;
        this.subResults = options.subResults;
        this.resolved = false;
        this.cancelled = false;
        this.value = null;
        this.numValues = null;
    }

    hasNoChoices() {
        return this.eligibleChoices.length === 0;
    }

    isEligible(choice) {
        return this.eligibleChoices.includes(choice);
    }

    hasValue() {
        if (Array.isArray(this.value)) {
            return this.value.length !== 0;
        }

        return !!this.value;
    }

    resolve(value) {
        this.resolved = true;
        this.value = value;
        this.numValues = Array.isArray(this.value) ? this.value.length : this.value ? 1 : 0;
    }

    reject() {
        this.resolved = true;
        this.value = null;
        this.numValues = null;
    }

    cancel() {
        this.cancelled = true;
        this.reject();
    }
}

module.exports = AbilityChoiceSelection;
