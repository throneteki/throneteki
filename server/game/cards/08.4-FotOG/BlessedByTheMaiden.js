import DrawCard from '../../drawcard.js';

class BlessedByTheMaiden extends DrawCard {
    // Blessed by the Maiden (08064)
    // Character you control only.
    // Attached character gains The Seven trait and "No attachments except Blessing."
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
