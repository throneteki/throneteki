import DrawCard from '../../drawcard.js';

class Condemned extends DrawCard {
    // Condemned (02077)
    // Opponent's character only.
    // Attached character loses a [power] icon.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.removeIcon('power')
        });
    }
}

Condemned.code = '02077';

export default Condemned;
