import DrawCard from '../../drawcard.js';

class LittleBird extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('intrigue')
        });
    }
}

LittleBird.code = '01034';

export default LittleBird;
