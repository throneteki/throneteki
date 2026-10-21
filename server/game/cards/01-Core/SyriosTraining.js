import DrawCard from '../../drawcard.js';

class SyriosTraining extends DrawCard {
    // Syrio's Training (01037)
    // Attached character gains a [military] icon.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('military')
        });
    }
}

SyriosTraining.code = '01037';

export default SyriosTraining;
