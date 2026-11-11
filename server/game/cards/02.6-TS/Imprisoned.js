import DrawCard from '../../drawcard.js';

class Imprisoned extends DrawCard {
    // Imprisoned (02116)
    // Opponent's character only.
    // Attached character loses a [military] icon.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.removeIcon('military')
        });
    }
}

Imprisoned.code = '02116';

export default Imprisoned;
