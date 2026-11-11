import DrawCard from '../../drawcard.js';

class RedwyneStraits extends DrawCard {
    // Redwyne Straits (09018)
    // Limited.
    // +2 Income.
    setupCardAbilities() {
        this.plotModifiers({
            gold: 2
        });
    }
}

RedwyneStraits.code = '09018';

export default RedwyneStraits;
