/**
 * Represents a card selected by the player during targeting
 */
class AbilityChoiceSelection {
    constructor(options) {
        this.choosingPlayer = options.choosingPlayer;
        this.eligibleChoices = options.eligibleChoices;
        this.targetingType = options.targetingType;
        this.name = options.name;
        this.resolved = false;
        this.cancelled = false;
        this.value = null;
    }

    hasNoChoices() {
        return this.eligibleChoices.length === 0;
    }

    isEligible(choice) {
        return this.eligibleChoices.includes(choice);
    }

    hasValue() {
        if(Array.isArray(this.value)) {
            return this.value.length !== 0;
        }

        return !!this.value;
    }

    resolve(value) {
        this.resolved = true;
        this.value = value;
    }

    reject() {
        this.resolved = true;
        this.value = null;
    }

    cancel() {
        this.cancelled = true;
        this.reject();
    }
}

module.exports = AbilityChoiceSelection;
