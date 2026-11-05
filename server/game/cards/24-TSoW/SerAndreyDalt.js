import DrawCard from '../../drawcard.js';

class SerAndreyDalt extends DrawCard {
    // Ser Andrey Dalt (24010)
    // Shadow (3).
    // Each opponent cannot gain power from winning dominance.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.cannotGainDominancePower()
        });
    }
}

SerAndreyDalt.code = '24010';

export default SerAndreyDalt;
