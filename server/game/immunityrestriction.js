class ImmunityRestriction {
    constructor(cardCondition) {
        this.cardCondition = cardCondition;
    }

    isMatch(type, abilityContext) {
        return (
            abilityContext.resolutionStage === 'effect' &&
            abilityContext.source &&
            this.cardCondition(abilityContext.source, abilityContext)
        );
    }
}

module.exports = ImmunityRestriction;
