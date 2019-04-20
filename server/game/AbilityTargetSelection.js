/**
 * Represents a card selected by the player during targeting
 */
class AbilityTargetSelection {
    constructor(options) {
        this.choosingPlayer = options.choosingPlayer;
        this.eligibleCards = options.eligibleCards;
        this.targetingType = options.targetingType;
        this.name = options.name;
        this.resolved = false;
        this.cancelled = false;
        this.value = null;
    }

    isEligible(card) {
        return this.eligibleCards.includes(card);
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

module.exports = AbilityTargetSelection;
