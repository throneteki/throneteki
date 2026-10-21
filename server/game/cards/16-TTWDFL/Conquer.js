import DrawCard from '../../drawcard.js';

class Conquer extends DrawCard {
    // Conquer (16004)
    // Non-unique location only.
    // Take control of attached location.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location' });

        this.whileAttached({
            effect: ability.effects.takeControl(() => this.controller)
        });
    }
}

Conquer.code = '16004';

export default Conquer;
