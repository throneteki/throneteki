class ImmunityRestriction {
    constructor(cardCondition, immunitySource) {
        this.cardCondition = cardCondition;
        this.immunitySource = immunitySource;
    }

    isMatch(type, abilityContext) {
        return (
            abilityContext.resolutionStage === 'effect' &&
            abilityContext.source &&
            abilityContext.source !== this.immunitySource &&
            this.cardCondition(abilityContext.source, abilityContext)
        );
    }
}

export default ImmunityRestriction;
