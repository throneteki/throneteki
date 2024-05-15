import DrawCard from '../../drawcard.js';

class RedwyneStraits extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 2
        });
    }
}

RedwyneStraits.code = '09018';

export default RedwyneStraits;
