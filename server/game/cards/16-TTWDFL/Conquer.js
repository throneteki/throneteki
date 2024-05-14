import DrawCard from '../../drawcard.js';

class Conquer extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location' });

        this.whileAttached({
            effect: ability.effects.takeControl(() => this.controller)
        });
    }
}

Conquer.code = '16004';

export default Conquer;
