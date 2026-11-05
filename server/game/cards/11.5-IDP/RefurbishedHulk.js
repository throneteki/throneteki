import DrawCard from '../../drawcard.js';

class RefurbishedHulk extends DrawCard {
    // Refurbished Hulk (11092)
    // +1 Income.
    // +1 Initiative.
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1,
            initiative: 1
        });
    }
}

RefurbishedHulk.code = '11092';

export default RefurbishedHulk;
