import DrawCard from '../../drawcard.js';

class SerPounce extends DrawCard {
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
