import { Flags } from './Constants/index.js';
import Restriction from './restriction.js';

class ImmunityRestriction extends Restriction {
    constructor(cardCondition, immunitySource) {
        super(Flags.losesAspect.immunity);
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
