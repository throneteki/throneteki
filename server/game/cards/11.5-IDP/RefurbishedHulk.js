const DrawCard = require('../../drawcard.js');

class RefurbishedHulk extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1,
            initiative: 1
        });
    }
}

RefurbishedHulk.code = '11092';

module.exports = RefurbishedHulk;
