import DrawCard from '../../drawcard.js';

class RangingParty extends DrawCard {
    // Ranging Party (01132)
    // No attachments except Weapon.
    setupCardAbilities() {
        this.attachmentRestriction({ trait: 'Weapon' });
    }
}

RangingParty.code = '01132';

export default RangingParty;
