import DrawCard from '../../drawcard.js';

class Attainted extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.removeIcon('intrigue')
        });
    }
}

Attainted.code = '02055';

export default Attainted;
