import DrawCard from '../../drawcard.js';

class RefurbishedHulk extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1,
            initiative: 1
        });
    }
}

RefurbishedHulk.code = '11092';

export default RefurbishedHulk;
