import DrawCard from '../../drawcard.js';

class SyriosTraining extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('military')
        });
    }
}

SyriosTraining.code = '01037';

export default SyriosTraining;
