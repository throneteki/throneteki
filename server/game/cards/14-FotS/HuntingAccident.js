import DrawCard from '../../drawcard.js';

class HuntingAccident extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeStood()
        });
    }
}

HuntingAccident.code = '14021';

export default HuntingAccident;
