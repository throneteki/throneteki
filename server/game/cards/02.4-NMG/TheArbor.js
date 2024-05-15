import DrawCard from '../../drawcard.js';

class TheArbor extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 3
        });
    }
}

TheArbor.code = '02064';

export default TheArbor;
