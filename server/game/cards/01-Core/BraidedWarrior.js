import DrawCard from '../../drawcard.js';

class BraidedWarrior extends DrawCard {
    // Braided Warrior (01168)
    // No attachments except Weapon.
    setupCardAbilities() {
        this.attachmentRestriction({ trait: 'Weapon' });
    }
}

BraidedWarrior.code = '01168';

export default BraidedWarrior;
