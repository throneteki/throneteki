import DrawCard from '../../drawcard.js';

class Appointed extends DrawCard {
    // Appointed (05043)
    // Unique character only.
    // Attached character gains an [intrigue] icon and the Small Council trait.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true });
        this.whileAttached({
            effect: [ability.effects.addIcon('intrigue'), ability.effects.addTrait('Small Council')]
        });
    }
}

Appointed.code = '05043';

export default Appointed;
