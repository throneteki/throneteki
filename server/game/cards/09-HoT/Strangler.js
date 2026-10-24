import DrawCard from '../../drawcard.js';

class Strangler extends DrawCard {
    // Strangler (09043)
    // Terminal.
    // While attached character is participating in a challenge, set its STR to 1. (Other modifiers
    // do not raise or lower its STR.)
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => context.source.parent.isParticipating(),
            effect: ability.effects.setStrength(1)
        });
    }
}

Strangler.code = '09043';

export default Strangler;
