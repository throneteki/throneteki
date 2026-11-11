import DrawCard from '../../drawcard.js';

class TheArbor extends DrawCard {
    // The Arbor (02064)
    // Limited.
    // +3 Income.
    setupCardAbilities() {
        this.plotModifiers({
            gold: 3
        });
    }
}

TheArbor.code = '02064';

export default TheArbor;
