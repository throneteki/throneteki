import DrawCard from '../../drawcard.js';

class BlessedByTheMaiden extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            effect: [
                ability.effects.addTrait('The Seven'),
                ability.effects.restrictAttachmentsTo('Blessing')
            ]
        });
    }
}

BlessedByTheMaiden.code = '08064';

export default BlessedByTheMaiden;
