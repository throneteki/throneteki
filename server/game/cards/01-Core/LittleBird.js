import DrawCard from '../../drawcard.js';

class LittleBird extends DrawCard {
    // Little Bird (01034)
    // Attached character gains an [intrigue] icon.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('intrigue')
        });
    }
}

LittleBird.code = '01034';

export default LittleBird;
