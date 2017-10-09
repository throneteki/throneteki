/**
 * Represents a card selected by the player during targeting
 */
class AbilityTargetSelection {
    constructor({choosingPlayer, eligibleCards, name}) {
        this.choosingPlayer = choosingPlayer;
        this.eligibleCards = eligibleCards;
        this.name = name;
        this.resolved = false;
        this.value = null;
    }

    /**
     * Returns whether the card was a valid selection when the prompt started
     * @param {BaseCard} card
     * @returns {boolean}
     */
    isEligible(card) {
        return this.eligibleCards.includes(card);
    }

    resolve(value) {
        this.resolved = true;
        this.value = value;
    }

    reject() {
        this.resolved = true;
        this.value = null;
    }
}

module.exports = AbilityTargetSelection;
