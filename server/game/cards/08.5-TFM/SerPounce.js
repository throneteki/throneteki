import DrawCard from '../../drawcard.js';

class SerPounce extends DrawCard {
    // Ser Pounce (08090)
    // Unique character with printed cost 3 or lower only. Ambush (1).
    // Attached character gains an [intrigue] icon and does not kneel when declared as an attacker
    // in an [intrigue] challenge.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, printedCostOrLower: 3 });
        this.whileAttached({
            effect: ability.effects.addIcon('intrigue')
        });
        this.whileAttached({
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'intrigue' })
        });
    }
}

SerPounce.code = '08090';

export default SerPounce;
