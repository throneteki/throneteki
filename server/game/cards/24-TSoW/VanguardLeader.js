import DrawCard from '../../drawcard.js';

class VanguardLeader extends DrawCard {
    // Vanguard Leader (24027)
    // Unique character only.
    // Attached character gets +1 STR and gains the Commander trait.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true });
        this.whileAttached({
            effect: [ability.effects.addTrait('Commander'), ability.effects.modifyStrength(1)]
        });
    }
}

VanguardLeader.code = '24027';

export default VanguardLeader;
