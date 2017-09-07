const DrawCard = require('../../../drawcard.js');

class RedwyneStraits extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 2
        });
    }
}

RedwyneStraits.code = '09018';

module.exports = RedwyneStraits;
