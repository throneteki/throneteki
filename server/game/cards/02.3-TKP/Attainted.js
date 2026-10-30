import DrawCard from '../../drawcard.js';

class Attainted extends DrawCard {
    // Attainted (02055)
    // Opponent's character only.
    // Attached character loses an [intrigue] icon.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.removeIcon('intrigue')
        });
    }
}

Attainted.code = '02055';

export default Attainted;
